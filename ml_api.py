"""
ml_api.py — Doon Explorer ML Server (Flask)
RandomForest model for annual tourist volume prediction
Port: 5000
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
import calendar
import threading

# Optional imports — graceful fallback if not installed
try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.metrics import mean_absolute_error, mean_squared_error
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    import holidays
    HOLIDAYS_AVAILABLE = True
except ImportError:
    HOLIDAYS_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# ── Global model state ────────────────────────────────────────
model_state = {
    'ready': False,
    'training': False,
    'mae': None,
    'rmse': None,
    'mape': None,
    'error': None,
    'data': None,
}

FEATURES = ['Year', 'Month', 'month_sin', 'month_cos', 'Growth', 'lag-1', 'lag-12', 'Weekdays', 'Weekends', 'Holidays']
model = None
feature_data = None

DATASET_PATHS = [
    'draft1-dataset1(1).xlsx',
    'draft1-dataset1.xlsx',
    '../draft1-dataset1(1).xlsx',
    '../draft1-dataset1.xlsx',
]

# ── Calendar helper ───────────────────────────────────────────
def get_calendar_features(year, month):
    india_holidays = holidays.India() if HOLIDAYS_AVAILABLE else {}
    dates = pd.date_range(
        start=f"{year}-{month:02d}-01",
        end=f"{year}-{month:02d}-{calendar.monthrange(year, month)[1]}"
    )
    weekdays = sum(1 for d in dates if d.weekday() < 5)
    weekends = sum(1 for d in dates if d.weekday() >= 5)
    holiday_count = sum(1 for d in dates if d in india_holidays)
    return weekdays, weekends, holiday_count

# ── Load or generate calendar features ───────────────────────
def get_calendar_df(year_min, year_max):
    cache_file = 'calendar_features.json'
    if os.path.exists(cache_file):
        with open(cache_file) as f:
            return pd.DataFrame(json.load(f))
    data = []
    for y in range(year_min, year_max + 2):
        for m in range(1, 13):
            w, we, h = get_calendar_features(y, m)
            data.append({'Year': y, 'Month': m, 'Weekdays': w, 'Weekends': we, 'Holidays': h})
    with open(cache_file, 'w') as f:
        json.dump(data, f)
    return pd.DataFrame(data)

# ── Train model ───────────────────────────────────────────────
def train_model():
    global model, feature_data, model_state
    model_state['training'] = True
    model_state['error'] = None

    if not SKLEARN_AVAILABLE:
        model_state['error'] = 'scikit-learn not installed. Run: pip install scikit-learn'
        model_state['training'] = False
        return

    # Find dataset
    dataset_path = None
    for p in DATASET_PATHS:
        if os.path.exists(p):
            dataset_path = p
            break

    if not dataset_path:
        model_state['error'] = 'Dataset not found. Place draft1-dataset1.xlsx in project root.'
        model_state['training'] = False
        return

    try:
        data = pd.read_excel(dataset_path)
        data['Date'] = pd.to_datetime(data.iloc[:, 0])
        data['Year'] = data['Date'].dt.year
        data['Month'] = data['Date'].dt.month
        data['Tourists'] = data.iloc[:, 1]
        data = data.sort_values('Date')

        data['month_sin'] = np.sin(2 * np.pi * data['Month'] / 12)
        data['month_cos'] = np.cos(2 * np.pi * data['Month'] / 12)
        data['lag-1']  = data['Tourists'].shift(1)
        data['lag-12'] = data['Tourists'].shift(12)
        data['Growth'] = data['Tourists'].pct_change(12).shift(1)
        data = data.dropna()

        cal_df = get_calendar_df(int(data['Year'].min()), int(data['Year'].max()))
        data = data.merge(cal_df, on=['Year', 'Month'], how='left')
        feature_data = data.copy()

        train = data[data['Year'] < 2025]
        test  = data[data['Year'] == 2025]

        X_train, y_train = train[FEATURES], train['Tourists']

        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X_train, y_train)
        model = rf

        if not test.empty:
            preds = rf.predict(test[FEATURES])
            mae  = mean_absolute_error(test['Tourists'], preds)
            rmse = float(np.sqrt(mean_squared_error(test['Tourists'], preds)))
            mape = float(np.mean(np.abs((test['Tourists'].values - preds) / test['Tourists'].values)) * 100)
            model_state.update({'mae': mae, 'rmse': rmse, 'mape': mape})

        model_state.update({'ready': True, 'training': False})
        print(f"✅ Model trained. MAE={model_state.get('mae','N/A')}")

    except Exception as e:
        model_state.update({'error': str(e), 'training': False})
        print(f"❌ Training error: {e}")

# ── Build prediction row ───────────────────────────────────────
def build_pred_row(year, month, lag1, lag12):
    """Build a feature row for prediction."""
    w, we, h = get_calendar_features(year, month)
    growth = ((lag1 - lag12) / lag12) if lag12 and lag12 != 0 else 0.0
    return {
        'Year': year,
        'Month': month,
        'month_sin': np.sin(2 * np.pi * month / 12),
        'month_cos': np.cos(2 * np.pi * month / 12),
        'Growth': growth,
        'lag-1': lag1,
        'lag-12': lag12,
        'Weekdays': w,
        'Weekends': we,
        'Holidays': h
    }

# ── Routes ────────────────────────────────────────────────────
@app.route('/status')
def status():
    return jsonify({
        'ready':    model_state['ready'],
        'training': model_state['training'],
        'mae':      model_state.get('mae'),
        'rmse':     model_state.get('rmse'),
        'mape':     model_state.get('mape'),
        'error':    model_state.get('error'),
        'sklearn':  SKLEARN_AVAILABLE,
    })

@app.route('/train', methods=['POST'])
def train_route():
    if model_state['training']:
        return jsonify({'message': 'Already training…'})
    t = threading.Thread(target=train_model)
    t.start()
    return jsonify({'message': 'Training started'})

@app.route('/predict', methods=['POST'])
def predict_route():
    if not model:
        return jsonify({'error': 'Model not ready'}), 503
    data = request.json or {}
    row = build_pred_row(
        int(data.get('year', 2025)),
        int(data.get('month', 1)),
        float(data.get('lag1', 50000)),
        float(data.get('lag12', 48000))
    )
    df = pd.DataFrame([row])
    pred = float(model.predict(df[FEATURES])[0])
    return jsonify({'prediction': round(pred), 'year': row['Year'], 'month': row['Month']})

@app.route('/forecast-annual')
def forecast_annual():
    if not model:
        return jsonify({'error': 'Model not ready. Train first.'}), 503
    year  = int(request.args.get('year', 2025))
    lag1  = float(request.args.get('lag1', 50000))
    lag12 = float(request.args.get('lag12', 48000))

    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    values = []
    curr_lag1 = lag1
    curr_lag12 = lag12

    for m in range(1, 13):
        row = build_pred_row(year, m, curr_lag1, curr_lag12)
        df = pd.DataFrame([row])
        pred = float(model.predict(df[FEATURES])[0])
        values.append(round(pred))
        curr_lag12 = curr_lag1
        curr_lag1  = pred

    return jsonify({
        'year': year,
        'months': months,
        'values': values,
        'mae': model_state.get('mae'),
        'rmse': model_state.get('rmse'),
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'port': 5000})

# ── Auto-train on startup ─────────────────────────────────────
if __name__ == '__main__':
    print("🤖 Starting ML API server on port 5000…")
    print("📊 Attempting to train model on startup…")
    t = threading.Thread(target=train_model)
    t.daemon = True
    t.start()
    app.run(host='0.0.0.0', port=5000, debug=False)
