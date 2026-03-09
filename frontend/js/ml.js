// ml.js — ML Forecast panel for Doon Explorer

let mlYear = new Date().getFullYear();
let mlData = null;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function checkMLStatus() {
  const dot = document.getElementById('ml-dot');
  const txt = document.getElementById('ml-chip-text');
  try {
    const r = await fetch('/api/ml/status');
    const d = await r.json();
    if(d.ready) {
      dot.className = 'ml-status-dot'; dot.style.background = '#22c55e';
      dot.style.boxShadow = '0 0 5px #22c55e';
      txt.textContent = d.mae ? 'MAE: '+Math.round(d.mae) : 'Model Ready';
    } else {
      dot.className = 'ml-status-dot'; dot.style.background = '#f59e0b';
      txt.textContent = 'Training…';
    }
  } catch(e) {
    dot.className = 'ml-status-dot'; dot.style.background = '#ef4444';
    txt.textContent = 'Using local data';
  }
}

window.loadMLForecast = async function() {
  const chart = document.getElementById('ml-bar-chart');
  if(!chart) return;
  chart.innerHTML = '<div class="ml-placeholder">Loading forecast…</div>';

  try {
    const r = await fetch(`/api/ml/forecast-annual?year=${mlYear}`);
    const d = await r.json();
    if(d.error) throw new Error(d.error);
    mlData = d;
    renderMLChart(d);
  } catch(e) {
    // Fallback to simulated data
    const fakeData = simulateMLData(mlYear);
    mlData = fakeData;
    renderMLChart(fakeData);
  }
};

function simulateMLData(year) {
  // Simulate realistic tourist data for Dehradun
  const base = [28000, 30000, 45000, 58000, 62000, 35000, 30000, 55000, 52000, 70000, 60000, 50000];
  const growth = (year - 2020) * 0.03;
  return {
    months: MONTHS,
    values: base.map(v => Math.round(v * (1 + growth) * (0.9 + Math.random()*0.2))),
    year
  };
}

function renderMLChart(data) {
  const chart = document.getElementById('ml-bar-chart');
  if(!chart) return;

  const values = data.values || [];
  const maxV = Math.max(...values, 1);
  const minV = Math.min(...values);
  const peakIdx = values.indexOf(Math.max(...values));
  const quietIdx = values.indexOf(minV);

  chart.innerHTML = '';
  values.forEach((v, i) => {
    const pct = Math.round((v / maxV) * 100);
    const isPeak = i === peakIdx;
    const col = document.createElement('div');
    col.className = `ml-bar-col${isPeak?' peak':''}`;
    col.innerHTML = `
      <div class="ml-bar-top">${(v/1000).toFixed(0)}K</div>
      <div class="ml-bar-body">
        <div class="ml-bar-fill" style="height:${Math.max(pct,3)}%"></div>
      </div>
      <div class="ml-bar-lbl">${MONTHS[i]}</div>`;
    chart.appendChild(col);
  });

  // Stats
  const total = values.reduce((a,b)=>a+b,0);
  document.getElementById('ml-peak').textContent = MONTHS[peakIdx];
  document.getElementById('ml-total').textContent = (total/1000).toFixed(0)+'K';
  document.getElementById('ml-quiet').textContent = MONTHS[quietIdx];
  document.getElementById('ml-year').textContent = data.year || mlYear;

  try {
    fetch('/api/ml/status').then(r=>r.json()).then(d => {
      if(d.mae) document.getElementById('ml-mae').textContent = Math.round(d.mae).toLocaleString();
    });
  } catch(e) {}
}

window.changeMLYear = function(dir) {
  mlYear = Math.max(2020, Math.min(2030, mlYear + dir));
  document.getElementById('ml-year').textContent = mlYear;
  loadMLForecast();
};

document.addEventListener('DOMContentLoaded', () => {
  checkMLStatus();
  loadMLForecast();
});
