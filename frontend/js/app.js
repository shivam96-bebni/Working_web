// app.js — Main application controller for Doon Explorer v2
// Handles: panels, places, hotels, shops, time, weather, detail modal

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const state = {
  hour:    new Date().getHours(),
  weather: 'sunny',
  temp:    null,
  selectedPlace: null,
  gallery: { idx: 0, photos: [] }
};

// ── Helpers ───────────────────────────────────────────────────
function hourLabel(h) { return h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h-12}:00 PM`; }
function crowdClass(p) { return p<=30?'cf-low':p<=55?'cf-mod':p<=75?'cf-hi':'cf-peak'; }
function crowdLabel(p) { return p<=30?'🟢 Comfortable':p<=55?'🟡 Moderate':p<=75?'🟠 Crowded':'🔴 Very Crowded'; }
function alertClass(p) { return p<=40?'al-good':p<=70?'al-mod':'al-hi'; }
function alertMsg(p) {
  if(p<=20) return '✨ Great time — very peaceful';
  if(p<=40) return '👍 Good time — comfortable crowds';
  if(p<=65) return '⚠️ Moderate — plan accordingly';
  if(p<=80) return '🕐 Busy — try early morning';
  return '🚫 Very busy! Off-peak recommended';
}
function isOpenNow(place) { return state.hour >= place.openHour && state.hour < place.closeHour; }

function toast(msg, dur=2500) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), dur);
}

// ── Clock ─────────────────────────────────────────────────────
function startClock() {
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-IN',{hour12:false});
    $('sw-time').textContent = t;
    const mobTime = $('mob-time');
    if(mobTime) mobTime.textContent = t;
  };
  tick(); setInterval(tick, 1000);
}

// ── Panel switching ───────────────────────────────────────────
window.switchPanel = function(name, btn) {
  $$('.panel').forEach(p=>p.classList.remove('active'));
  $$('.snav').forEach(b=>b.classList.remove('active'));
  const panel = $('panel-'+name);
  if(panel) panel.classList.add('active');
  if(btn) btn.classList.add('active');
  closeSidebar();
};

window.toggleSidebar = function() { $('sidebar').classList.toggle('open'); };
function closeSidebar() { $('sidebar').classList.remove('open'); }

// ── Hour control ──────────────────────────────────────────────
window.changeHour = function(dir) {
  state.hour = Math.max(5, Math.min(23, state.hour + dir));
  updateHourDisplays();
  renderPlaces();
  updateShopStatus();
  if(window.updateMapMarkers) updateMapMarkers();
};

function updateHourDisplays() {
  const lbl = hourLabel(state.hour);
  const els = [$('map-time-val'), $('places-hour-val')];
  els.forEach(el=>{ if(el) el.textContent = lbl; });
}

// ── Weather ───────────────────────────────────────────────────
window.setWeather = function(btn, w) {
  $$('.wxp').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  state.weather = w;
  renderPlaces();
  if(window.updateMapMarkers) updateMapMarkers();
};

// ── Weather API ───────────────────────────────────────────────
async function loadWeather() {
  try {
    const r = await fetch('/api/weather');
    const d = await r.json();
    state.temp = d.temperature;
    const temp = d.temperature != null ? `${Math.round(d.temperature)}°C` : '--°C';
    $('sw-temp').textContent = temp;
    $('sw-cond').textContent = d.condition || 'Clear';
    $('ps-temp').textContent = temp;
    // Set weather condition
    const wx = document.querySelector(`.wxp[data-w="${d.condition}"]`);
    if(wx){ $$('.wxp').forEach(b=>b.classList.remove('active')); wx.classList.add('active'); state.weather = d.condition; }
    renderPlaces();
  } catch(e){
    $('sw-temp').textContent = '22°C';
    $('sw-cond').textContent = 'Sunny';
  }
}

// ── Render Places ─────────────────────────────────────────────
async function renderPlaces() {
  const h = state.hour, w = state.weather;
  let places = window.PLACES_DATA || [];

  // Try API first, fallback to static
  try {
    const r = await fetch(`/api/places?hour=${h}&weather=${w}`);
    if(r.ok) {
      const apiPlaces = await r.json();
      if(apiPlaces && apiPlaces.length) places = apiPlaces;
    }
  } catch(e) { /* use static data */ }

  const grid = $('places-grid');
  if(!grid) return;
  grid.innerHTML = '';

  let openCount=0, totalCrowd=0, minCrowd=999, bestName='--';

  places.forEach(p => {
    const cd = window.getCrowdData ? window.getCrowdData(p.id, w) : Array(18).fill(p.avgCrowd||40);
    const idx = Math.max(0, h - 6);
    const crowd = cd[idx] || p.avgCrowd || 40;
    p._crowd = crowd;
    p._cd = cd;
    const open = h >= p.openHour && h < p.closeHour;
    if(open){ openCount++; if(crowd < minCrowd){ minCrowd=crowd; bestName=p.name; } }
    totalCrowd += crowd;
    grid.appendChild(buildPlaceCard(p, crowd, cd, open, h));
  });

  $('ps-open').textContent = openCount;
  $('ps-crowd').textContent = `${Math.round(totalCrowd/Math.max(places.length,1))}%`;
  $('ps-best').textContent = bestName.split(' ')[0];
  $('sf-open').textContent = openCount;
  $('sf-crowd').textContent = `${Math.round(totalCrowd/Math.max(places.length,1))}%`;

  filterPlaces();
}

function buildPlaceCard(p, crowd, cd, open, h) {
  const card = document.createElement('div');
  card.className = 'place-card';
  card.dataset.category = p.category;

  const cls = crowdClass(crowd);
  const lbl = crowdLabel(crowd);
  const ac = alertClass(crowd);
  const am = alertMsg(crowd);
  const peakLbl = p.peakHour < 12 ? `${p.peakHour} AM` : p.peakHour===12?'12 PM':`${p.peakHour-12} PM`;
  const dotColor = crowd<=30?'#22c55e':crowd<=55?'#f59e0b':crowd<=75?'#f97316':'#ef4444';

  const mini = cd.map((v,i)=>{
    const isCur = (i+6)===h;
    return `<div class="pc-mini-bar ${crowdClass(v)}${isCur?' cur':''}" style="height:${Math.max(v*0.3,2)}px"></div>`;
  }).join('');

  const tags = (p.tags||[]).slice(0,3).map(t=>`<span class="pc-tag">${t}</span>`).join('');
  const thumb = (p.photos||[])[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  card.innerHTML = `
    <div class="pc-photo-wrap">
      <img class="pc-photo" src="${thumb}" alt="${p.name}" loading="lazy">
      <div class="pc-badge">${p.category}</div>
      <div class="pc-status-dot" style="background:${dotColor}; color:${dotColor}"></div>
    </div>
    <div class="pc-body">
      <div class="pc-header">
        <div class="pc-emoji">${p.emoji}</div>
        <div class="pc-info">
          <div class="pc-name">${p.name}</div>
          <div class="pc-sub">${p.subtitle}</div>
        </div>
        <div class="pc-rating">⭐ ${p.rating}</div>
      </div>
      <div class="pc-crowd-wrap">
        <div class="pc-crowd-lbl"><span>${lbl}</span><span class="pc-crowd-pct">${crowd}%</span></div>
        <div class="pc-crowd-bar"><div class="pc-crowd-fill ${cls}" style="width:${crowd}%"></div></div>
      </div>
      <div class="pc-mini-chart">${mini}</div>
      <div class="pc-alert ${ac}">${am}</div>
      <div class="pc-footer">
        <div class="pc-tags">${tags}</div>
        <div class="pc-open-lbl ${open?'open':'close'}">${open?`🟢 Open · Peak ${peakLbl}`:'🔴 Closed'}</div>
      </div>
    </div>`;

  card.addEventListener('click', () => openDetail(p));
  return card;
}

window.filterPlaces = function() {
  const cat = $('cat-filter')?.value || 'all';
  $$('.place-card').forEach(c => {
    c.classList.toggle('hidden-card', cat !== 'all' && c.dataset.category !== cat);
  });
};

// ── Hotels ────────────────────────────────────────────────────
function renderHotels() {
  const grid = $('hotels-grid');
  if(!grid) return;
  grid.innerHTML = '';
  window.HOTELS_DATA.forEach(h => grid.appendChild(buildHotelCard(h)));
}

function buildHotelCard(h) {
  const card = document.createElement('div');
  card.className = 'hotel-card';
  card.dataset.type = h.type;
  const stars = '⭐'.repeat(h.stars);
  const avCls = {available:'av-available',limited:'av-limited',full:'av-full'}[h.availability]||'av-available';
  const avTxt = {available:'✅ Available',limited:'⚠️ Limited Rooms',full:'❌ Fully Booked'}[h.availability];
  const amenities = h.amenities.map(a=>`<span class="hc-amenity">${a}</span>`).join('');
  card.innerHTML = `
    <div class="hc-img">
      <img src="${h.img}" alt="${h.name}" loading="lazy">
      <div class="hc-type-badge">${h.type.charAt(0).toUpperCase()+h.type.slice(1)}</div>
      <div class="hc-availability ${avCls}">${avTxt}</div>
    </div>
    <div class="hc-body">
      <div class="hc-name">${h.name}</div>
      <div class="hc-location">📍 ${h.location}</div>
      <div class="hc-stars">${stars} <span style="color:var(--text-muted);font-size:0.78rem">  ${h.rating}/5.0</span></div>
      <div class="hc-amenities">${amenities}</div>
      <div class="hc-footer">
        <div class="hc-price">
          <div class="hc-price-val">₹${h.price.toLocaleString()}</div>
          <div class="hc-price-night">per night</div>
        </div>
        <a href="${h.bookingUrl}" target="_blank" class="hc-book-btn">Book Now →</a>
      </div>
    </div>`;
  return card;
}

window.filterHotels = function() {
  const type = $('hotel-filter').value;
  $$('.hotel-card').forEach(c => c.classList.toggle('hidden-card', type!=='all' && c.dataset.type !== type));
};

// ── Shops ─────────────────────────────────────────────────────
function renderShops() {
  const grid = $('shops-grid');
  if(!grid) return;
  grid.innerHTML = '';
  window.SHOPS_DATA.forEach(s => grid.appendChild(buildShopCard(s)));
}

function buildShopCard(s) {
  const card = document.createElement('div');
  card.className = 'shop-card';
  card.dataset.type = s.type;
  updateShopCardDOM(card, s);
  return card;
}

function updateShopCardDOM(card, s) {
  const open = state.hour >= s.openHour && state.hour < s.closeHour;
  const openTxt = `${s.openHour < 12 ? s.openHour+'AM' : s.openHour===12?'12PM':(s.openHour-12)+'PM'} – ${s.closeHour < 12?s.closeHour+'AM':s.closeHour===12?'12PM':(s.closeHour-12)+'PM'}`;
  card.innerHTML = `
    <div class="shop-status-bar ${open?'open-bar':'closed-bar'}"></div>
    <div class="sc-header">
      <div class="sc-icon">${s.icon}</div>
      <div class="sc-info">
        <div class="sc-name">${s.name}</div>
        <div class="sc-type">${s.type.charAt(0).toUpperCase()+s.type.slice(1)}</div>
      </div>
      <div class="sc-open-badge ${open?'sco-open':'sco-closed'}">${open?'🟢 Open':'🔴 Closed'}</div>
    </div>
    <div class="sc-hours">🕐 Hours: ${openTxt}</div>
    <div class="sc-crowd-hint">💡 ${s.crowdNote}</div>
    <div class="sc-address">📍 ${s.address}
      <a href="https://www.google.com/maps/search/${encodeURIComponent(s.name+' Dehradun')}" target="_blank" class="sc-map-link">Map ↗</a>
    </div>`;
}

function updateShopStatus() {
  $$('.shop-card').forEach((card, i) => {
    const s = window.SHOPS_DATA[i];
    if(s) updateShopCardDOM(card, s);
  });
  filterShops();
}

window.filterShops = function() {
  const type = $('shop-filter')?.value || 'all';
  const openOnly = $('open-only')?.checked || false;
  $$('.shop-card').forEach((card, i) => {
    const s = window.SHOPS_DATA[i];
    if(!s) return;
    const typeMatch = type==='all' || card.dataset.type===type;
    const openMatch = !openOnly || (state.hour >= s.openHour && state.hour < s.closeHour);
    card.classList.toggle('hidden-card', !typeMatch || !openMatch);
  });
};

// ── Detail Modal ──────────────────────────────────────────────
let currentDetailTab = 'overview';
let currentDetailPlace = null;
let galleryIdx = 0;

window.openDetail = function(p) {
  currentDetailPlace = p;
  galleryIdx = 0;
  const crowd = p._crowd || p.avgCrowd || 40;
  const cd = p._cd || (window.getCrowdData ? window.getCrowdData(p.id, state.weather) : Array(18).fill(40));

  // Gallery
  const photos = p.photos || ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80'];
  const photosEl = $('dm-photos');
  photosEl.innerHTML = photos.map(src=>`<img class="dm-photo" src="${src}" alt="${p.name}">`).join('');
  photosEl.style.transform = 'translateX(0)';
  $('dm-gtitle').textContent = p.name;
  $('dm-gsub').textContent = p.subtitle;
  const dotsEl = $('dm-dots');
  dotsEl.innerHTML = photos.map((_,i)=>`<div class="dm-dot${i===0?' active':''}" onclick="setGallery(${i})"></div>`).join('');

  // Reset tabs
  $$('.dmt').forEach((t,i)=>t.classList.toggle('active',i===0));
  currentDetailTab = 'overview';
  renderDetailTab(p, crowd, cd);

  $('detail-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.setGallery = function(idx) {
  if(!currentDetailPlace) return;
  const photos = currentDetailPlace.photos || [];
  galleryIdx = idx;
  $('dm-photos').style.transform = `translateX(-${idx*100}%)`;
  $$('.dm-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
};

window.galleryMove = function(dir) {
  if(!currentDetailPlace) return;
  const len = (currentDetailPlace.photos||[]).length || 1;
  setGallery((galleryIdx+dir+len)%len);
};

window.dmTab = function(btn, tab) {
  $$('.dmt').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  currentDetailTab = tab;
  const p = currentDetailPlace;
  if(!p) return;
  const crowd = p._crowd || p.avgCrowd || 40;
  const cd = p._cd || Array(18).fill(40);
  renderDetailTab(p, crowd, cd);
};

function renderDetailTab(p, crowd, cd) {
  const body = $('dm-body');
  if(currentDetailTab === 'overview') {
    const cls = crowdClass(crowd);
    const lbl = crowdLabel(crowd);
    body.innerHTML = `
      <div class="dmo-grid">
        <div class="dmo-left">
          <p class="dmo-desc">${p.desc}</p>
          <div class="dmo-meta">
            <div class="dmo-meta-item"><div class="dmo-meta-icon">🎟</div><div><div class="dmo-meta-lbl">Entry Fee</div><div class="dmo-meta-val">${p.entryFee}</div></div></div>
            <div class="dmo-meta-item"><div class="dmo-meta-icon">📍</div><div><div class="dmo-meta-lbl">Distance</div><div class="dmo-meta-val">${p.distance}</div></div></div>
            <div class="dmo-meta-item"><div class="dmo-meta-icon">⭐</div><div><div class="dmo-meta-lbl">Rating</div><div class="dmo-meta-val">${p.rating} / 5.0</div></div></div>
            <div class="dmo-meta-item"><div class="dmo-meta-icon">🕐</div><div><div class="dmo-meta-lbl">Hours</div><div class="dmo-meta-val">${p.openHour}:00 AM – ${p.closeHour > 12 ? p.closeHour-12+':00 PM' : p.closeHour+':00'}</div></div></div>
          </div>
          <div class="dmo-tags">${(p.tags||[]).map(t=>`<span class="dmo-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="dmo-right">
          <div class="dmo-crowd-now">
            <div class="dmo-cn-lbl">Current Crowd</div>
            <div class="dmo-cn-val">${crowd}%</div>
            <div class="dmo-cn-badge ${cls}" style="background:rgba(0,0,0,0.15)">${lbl}</div>
            <div class="dmo-cn-bar"><div class="dmo-cn-fill ${cls}" style="width:${crowd}%"></div></div>
          </div>
        </div>
      </div>`;
  }
  else if(currentDetailTab === 'crowd') {
    const maxV = Math.max(...cd, 1);
    const bars = cd.map((v,i)=>{
      const h = i+6; const pct = Math.round((v/maxV)*100);
      return `<div class="dmc-bar ${crowdClass(v)}${h===state.hour?' active-hr':''}" style="height:${Math.max(pct,2)}%"></div>`;
    }).join('');
    const minV = Math.min(...cd); const minIdx = cd.indexOf(minV); const bestH = minIdx+6;
    const bestLbl = bestH<12?`${bestH}:00 AM`:bestH===12?'12:00 PM':`${bestH-12}:00 PM`;
    body.innerHTML = `
      <div class="dmc-stats">
        <div class="dmc-stat"><div class="dmc-stat-val">${crowd}%</div><div class="dmc-stat-lbl">Right Now</div></div>
        <div class="dmc-stat"><div class="dmc-stat-val">${p.peakCrowd || Math.max(...cd)}%</div><div class="dmc-stat-lbl">Peak Today</div></div>
        <div class="dmc-stat"><div class="dmc-stat-val">${p.avgCrowd || Math.round(cd.reduce((a,b)=>a+b,0)/cd.length)}%</div><div class="dmc-stat-lbl">Daily Avg</div></div>
      </div>
      <div class="dmc-chart-lbl">Crowd by hour (6 AM – 11 PM)</div>
      <div class="dmc-chart">${bars}</div>
      <div class="dmc-axis"><span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>11PM</span></div>
      <div class="dmc-best">
        <div class="dmc-best-icon">🌅</div>
        <div>
          <div class="dmc-best-lbl">Best Time to Visit</div>
          <div class="dmc-best-val">Quietest around ${bestLbl} (${minV}% crowd)</div>
        </div>
      </div>`;
  }
  else if(currentDetailTab === 'history') {
    const hist = p.history || {};
    const facts = (hist.facts||[]).map(f=>`<li>${f}</li>`).join('');
    body.innerHTML = `
      <div class="dmh-established">📅 ${hist.established||'Historical site'}</div>
      <p class="dmh-text">${hist.significance||p.desc}</p>
      <div class="dmh-facts-title">📌 Key Facts</div>
      <ul class="dmh-facts">${facts}</ul>`;
  }
  else if(currentDetailTab === 'tips') {
    body.innerHTML = `
      <div class="dmt-box">
        <div class="dmt-box-icon">💡</div>
        <div class="dmt-box-text">${p.tips||'Enjoy your visit!'}</div>
      </div>
      <div class="dmt-actions">
        <a class="dmt-btn" href="https://www.google.com/maps/search/${encodeURIComponent(p.name+' Dehradun')}" target="_blank">🗺 Open in Google Maps</a>
        <a class="dmt-btn sec" href="https://www.tripadvisor.in" target="_blank">📖 Reviews on TripAdvisor ↗</a>
        <a class="dmt-btn sec" href="https://www.booking.com/city/in/dehradun.html" target="_blank">🏨 Find Nearby Hotels</a>
      </div>`;
  }
}

window.closeDetail = function(e) { if(e.target === $('detail-overlay')) closeDetailBtn(); };
window.closeDetailBtn = function() {
  $('detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => { if(e.key==='Escape') closeDetailBtn(); });

// ── Open detail from map ──────────────────────────────────────
window.openDetailFromMap = function() {
  if(window._mapSelectedPlace) openDetail(window._mapSelectedPlace);
};

// ── Loading screen ────────────────────────────────────────────
function hideLoading() {
  setTimeout(() => $('loading')?.classList.add('gone'), 2100);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  updateHourDisplays();
  await loadWeather();
  await renderPlaces();
  renderHotels();
  renderShops();
  hideLoading();
  setInterval(loadWeather, 10*60*1000);
  setInterval(updateShopStatus, 60*1000);
});
