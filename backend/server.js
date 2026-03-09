/**
 * server.js — Doon Explorer v2 Backend
 * Express server: weather proxy, places API, ML proxy
 */
const express = require('express');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL || 'http://localhost:5000';

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Helper: fetch with timeout ───────────────────────────────
function fetchJSON(url) {
  return new Promise((res, rej) => {
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, r => {
      let body = '';
      r.on('data', d => body += d);
      r.on('end', () => { try { res(JSON.parse(body)); } catch(e){ rej(e); } });
    }).on('error', rej).setTimeout(8000, function(){ this.destroy(); rej(new Error('timeout')); });
  });
}

// ── Weather API ──────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=30.3165&longitude=78.0322&current_weather=true&hourly=temperature_2m,weathercode&timezone=Asia/Kolkata';
    const data = await fetchJSON(url);
    const cw = data.current_weather || {};
    const temp = cw.temperature;
    const wcode = cw.weathercode || 0;

    let condition = 'sunny';
    if(wcode >= 51 && wcode <= 67) condition = 'rainy';
    else if(wcode >= 71 && wcode <= 77) condition = 'foggy';
    else if(wcode >= 45 || wcode >= 1) condition = 'cloudy';
    if(wcode === 0 || wcode === 1) condition = 'sunny';

    res.json({ temperature: temp, condition, windspeed: cw.windspeed, code: wcode });
  } catch(e) {
    res.json({ temperature: 22, condition: 'sunny', windspeed: 10 });
  }
});

// ── Places API ───────────────────────────────────────────────
const PLACES = [
  { id:'robbers-cave',  name:"Robber's Cave", subtitle:'Guchhupani — Natural cave', emoji:'🕳️', category:'nature',   rating:4.4, entryFee:'₹30', distance:'8 km', openHour:7,  closeHour:18, peakHour:11, peakCrowd:82, avgCrowd:48, lat:30.3835, lng:78.0090, tags:['Cave','River','Nature'] },
  { id:'sahastradhara', name:'Sahastradhara', subtitle:'Sulphur springs & waterfalls', emoji:'💧', category:'waterfall', rating:4.2, entryFee:'₹25', distance:'11 km', openHour:7, closeHour:19, peakHour:12, peakCrowd:78, avgCrowd:52, lat:30.4033, lng:78.1148, tags:['Waterfall','Springs','Family'] },
  { id:'tapkeshwar',    name:'Tapkeshwar Temple', subtitle:'Ancient Shiva cave temple', emoji:'🛕', category:'temple',  rating:4.6, entryFee:'Free', distance:'5.5 km', openHour:5,closeHour:22, peakHour:8, peakCrowd:75, avgCrowd:45, lat:30.3456, lng:78.0134, tags:['Temple','Shiva','Pilgrimage'] },
  { id:'malsi-deer-park', name:'Malsi Deer Park', subtitle:'Wildlife sanctuary & zoo', emoji:'🦌', category:'wildlife', rating:4.1, entryFee:'₹50', distance:'10 km', openHour:8, closeHour:17, peakHour:11, peakCrowd:65, avgCrowd:42, lat:30.4098, lng:77.9756, tags:['Wildlife','Zoo','Family'] },
  { id:'paltan-bazaar', name:'Paltan Bazaar', subtitle:'Main market & shopping', emoji:'🛍️', category:'market', rating:4.3, entryFee:'Free', distance:'0.5 km', openHour:9,closeHour:22, peakHour:17, peakCrowd:90, avgCrowd:65, lat:30.3224, lng:78.0336, tags:['Shopping','Street Food','Market'] },
  { id:'fri',           name:'Forest Research Institute', subtitle:'UNESCO heritage campus', emoji:'🏛️', category:'heritage', rating:4.7, entryFee:'₹40', distance:'5 km', openHour:9,closeHour:17, peakHour:11, peakCrowd:70, avgCrowd:48, lat:30.3410, lng:77.9962, tags:['Heritage','Museum','Architecture'] },
  { id:'mindrolling',   name:'Mindrolling Monastery', subtitle:'Buddhist monastery & stupa', emoji:'☸️', category:'heritage', rating:4.5, entryFee:'Free', distance:'5 km', openHour:8,closeHour:19, peakHour:11, peakCrowd:60, avgCrowd:38, lat:30.2980, lng:78.0469, tags:['Buddhist','Monastery','Peaceful'] },
  { id:'lacchiwala',    name:'Lacchiwala Nature Park', subtitle:'Forest park & river picnic', emoji:'🌲', category:'nature', rating:4.0, entryFee:'₹30', distance:'22 km', openHour:7,closeHour:18, peakHour:12, peakCrowd:55, avgCrowd:35, lat:30.2087, lng:78.0912, tags:['Forest','Picnic','River'] }
];

const CROWD_BASE = {
  'robbers-cave':   [10,15,25,40,55,62,70,75,72,65,52,40,30,22,15,10,8,6],
  'sahastradhara':  [8,12,22,38,52,68,75,78,72,62,50,38,28,20,14,10,8,6],
  'tapkeshwar':     [35,45,50,52,55,55,58,62,60,55,48,42,38,32,28,22,18,15],
  'malsi-deer-park':[5,8,15,28,42,52,60,65,60,50,38,28,18,12,8,5,4,3],
  'paltan-bazaar':  [5,8,12,18,28,38,48,62,72,80,88,90,85,78,70,62,50,35],
  'fri':            [5,8,15,28,42,55,65,70,65,55,42,30,20,12,8,5,4,3],
  'mindrolling':    [10,18,28,38,48,55,58,60,55,48,40,32,25,18,14,12,10,8],
  'lacchiwala':     [5,8,12,20,32,42,50,55,50,42,32,22,15,10,7,5,4,3]
};

function getCrowdData(id, weather) {
  const m = {sunny:1.0,cloudy:0.85,rainy:0.5,foggy:0.65}[weather]||1.0;
  return (CROWD_BASE[id]||Array(18).fill(20)).map(v=>Math.min(100,Math.round(v*m)));
}

app.get('/api/places', (req, res) => {
  const h   = parseInt(req.query.hour)    || new Date().getHours();
  const w   = req.query.weather           || 'sunny';
  const cat = req.query.category          || 'all';

  const places = PLACES
    .filter(p => cat==='all' || p.category===cat)
    .map(p => {
      const cd = getCrowdData(p.id, w);
      const idx = Math.max(0, Math.min(h-6, cd.length-1));
      return {
        ...p,
        crowdData: cd,
        currentCrowd: cd[idx],
        isOpen: h>=p.openHour && h<p.closeHour,
        photos: []
      };
    });
  res.json(places);
});

app.get('/api/places/:id', (req, res) => {
  const p = PLACES.find(x=>x.id===req.params.id);
  if(!p) return res.status(404).json({error:'Not found'});
  const h = parseInt(req.query.hour)||new Date().getHours();
  const w = req.query.weather||'sunny';
  const cd = getCrowdData(p.id, w);
  const idx = Math.max(0, Math.min(h-6, cd.length-1));
  res.json({ ...p, crowdData: cd, currentCrowd: cd[idx], isOpen: h>=p.openHour&&h<p.closeHour });
});

// ── ML Proxy ─────────────────────────────────────────────────
app.get('/api/ml/status', async (req, res) => {
  try {
    const d = await fetchJSON(`${ML_URL}/status`);
    res.json(d);
  } catch(e) { res.json({ ready: false, error: 'ML server unavailable' }); }
});

app.post('/api/ml/train', async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const mod = require('http');
      const postData = JSON.stringify(req.body);
      const options = { hostname:'localhost', port:5000, path:'/train', method:'POST',
        headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(postData)} };
      const r = mod.request(options, resp => {
        let body=''; resp.on('data',d=>body+=d); resp.on('end',()=>{try{resolve(JSON.parse(body))}catch(e){reject(e)}});
      });
      r.on('error', reject); r.write(postData); r.end();
    });
    res.json(data);
  } catch(e) { res.status(500).json({ error: 'ML training unavailable' }); }
});

app.post('/api/ml/predict', async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const mod = require('http');
      const postData = JSON.stringify(req.body);
      const options = { hostname:'localhost', port:5000, path:'/predict', method:'POST',
        headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(postData)} };
      const r = mod.request(options, resp => {
        let body=''; resp.on('data',d=>body+=d); resp.on('end',()=>{try{resolve(JSON.parse(body))}catch(e){reject(e)}});
      });
      r.on('error', reject); r.write(postData); r.end();
    });
    res.json(data);
  } catch(e) { res.status(500).json({ error: 'ML prediction unavailable' }); }
});

app.get('/api/ml/forecast-annual', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const lag1  = req.query.lag1  || 50000;
    const lag12 = req.query.lag12 || 48000;
    const d = await fetchJSON(`${ML_URL}/forecast-annual?year=${year}&lag1=${lag1}&lag12=${lag12}`);
    res.json(d);
  } catch(e) {
    // Return simulated fallback
    const year = parseInt(req.query.year)||new Date().getFullYear();
    const base = [28000,30000,45000,58000,62000,35000,30000,55000,52000,70000,60000,50000];
    const growth = (year-2020)*0.03;
    const values = base.map(v=>Math.round(v*(1+growth)));
    res.json({ year, months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], values });
  }
});

// ── Stats endpoint ───────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const h = new Date().getHours();
  const w = req.query.weather||'sunny';
  let open=0, total=0;
  PLACES.forEach(p => {
    const cd = getCrowdData(p.id, w);
    const idx = Math.max(0,Math.min(h-6,cd.length-1));
    total += cd[idx];
    if(h>=p.openHour&&h<p.closeHour) open++;
  });
  res.json({ openCount:open, avgCrowd:Math.round(total/PLACES.length), timestamp:new Date().toISOString() });
});

// ── Catch-all ─────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname,'../frontend/index.html')));

app.listen(PORT, () => console.log(`🏔️  Doon Explorer running at http://localhost:${PORT}`));
