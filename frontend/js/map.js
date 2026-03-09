// map.js — Interactive Leaflet map for Doon Explorer

let map = null;
let layers = { places: null, hotels: null, shops: null };
let layerVisible = { places: true, hotels: true, shops: true };

const DEHRADUN_CENTER = [30.3165, 78.0322];
const ZOOM = 12;

// Wait for Leaflet to load
function initMap() {
  if(typeof L === 'undefined') { setTimeout(initMap, 300); return; }

  map = L.map('leaflet-map', {
    center: DEHRADUN_CENTER,
    zoom: ZOOM,
    zoomControl: true,
    attributionControl: true
  });

  // Use OpenStreetMap tiles with dark style attempt
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  renderMapMarkers();
}

// ── Create custom marker icon ─────────────────────────────────
function createMarkerIcon(emoji, color, size=36) {
  const html = `
    <div style="
      width:${size}px; height:${size}px;
      background:${color};
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: ${size*0.45}px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      cursor: pointer;
    ">${emoji}</div>`;
  return L.divIcon({ className: '', html, iconSize: [size, size], iconAnchor: [size/2, size/2] });
}

function crowdColor(crowd) {
  if(crowd <= 30) return '#22c55e';
  if(crowd <= 55) return '#f59e0b';
  if(crowd <= 75) return '#f97316';
  return '#ef4444';
}

// ── Render all markers ────────────────────────────────────────
function renderMapMarkers() {
  if(!map) return;

  // Clear old layers
  ['places','hotels','shops'].forEach(k => {
    if(layers[k]) map.removeLayer(layers[k]);
    layers[k] = L.layerGroup();
  });

  const h = window.state?.hour || new Date().getHours();
  const w = window.state?.weather || 'sunny';

  // Place markers
  (window.PLACES_DATA || []).forEach(p => {
    const cd = window.getCrowdData ? window.getCrowdData(p.id, w) : Array(18).fill(40);
    const idx = Math.max(0, Math.min(h-6, cd.length-1));
    const crowd = cd[idx];
    const color = crowdColor(crowd);
    const marker = L.marker([p.lat, p.lng], { icon: createMarkerIcon(p.emoji, color) });
    marker.on('click', () => showInfoCard(p, crowd, 'Tourist Spot', color));
    layers.places.addLayer(marker);
  });

  // Hotel markers
  (window.HOTELS_DATA || []).forEach(h => {
    const marker = L.marker([h.lat, h.lng], { icon: createMarkerIcon('🏨', '#3b82f6', 32) });
    marker.on('click', () => showHotelCard(h));
    layers.hotels.addLayer(marker);
  });

  // Shop markers
  (window.SHOPS_DATA || []).forEach(s => {
    const open = (window.state?.hour || new Date().getHours()) >= s.openHour && (window.state?.hour || new Date().getHours()) < s.closeHour;
    const color = open ? '#a855f7' : '#6b7280';
    const marker = L.marker([s.lat, s.lng], { icon: createMarkerIcon(s.icon, color, 30) });
    marker.on('click', () => showShopCard(s, open));
    layers.shops.addLayer(marker);
  });

  // Add visible layers
  ['places','hotels','shops'].forEach(k => {
    if(layerVisible[k]) layers[k].addTo(map);
  });
}

// ── Info card ─────────────────────────────────────────────────
function showInfoCard(place, crowd, type, color) {
  window._mapSelectedPlace = place;
  window._mapSelectedPlace._crowd = crowd;
  window._mapSelectedPlace._cd = window.getCrowdData ? window.getCrowdData(place.id, window.state?.weather||'sunny') : Array(18).fill(crowd);

  const card = document.getElementById('map-infocard');
  document.getElementById('mic-type').textContent = type;
  document.getElementById('mic-name').textContent = place.name;
  document.getElementById('mic-sub').textContent = place.subtitle;
  document.getElementById('mic-crowd-fill').style.width = crowd + '%';
  document.getElementById('mic-crowd-fill').style.background = color;
  document.getElementById('mic-crowd-pct').textContent = crowd + '%';
  const h = window.state?.hour || new Date().getHours();
  const open = h >= place.openHour && h < place.closeHour;
  const statusEl = document.getElementById('mic-status');
  statusEl.textContent = open ? '🟢 Open now' : '🔴 Currently closed';
  statusEl.style.color = open ? '#86efac' : '#fca5a5';
  document.getElementById('mic-crowd-row').style.display = '';
  document.getElementById('mic-detail-btn').textContent = 'View Details →';
  card.classList.add('visible');
}

function showHotelCard(hotel) {
  window._mapSelectedPlace = null;
  const card = document.getElementById('map-infocard');
  document.getElementById('mic-type').textContent = '🏨 Hotel';
  document.getElementById('mic-name').textContent = hotel.name;
  document.getElementById('mic-sub').textContent = hotel.location;
  document.getElementById('mic-crowd-row').style.display = 'none';
  const av = {available:'✅ Available',limited:'⚠️ Limited',full:'❌ Full'}[hotel.availability];
  const statusEl = document.getElementById('mic-status');
  statusEl.textContent = `${av} · ₹${hotel.price.toLocaleString()}/night`;
  statusEl.style.color = '#7b92b2';
  const btn = document.getElementById('mic-detail-btn');
  btn.textContent = 'Book Now →';
  btn.onclick = () => window.open(hotel.bookingUrl, '_blank');
  card.classList.add('visible');
}

function showShopCard(shop, open) {
  window._mapSelectedPlace = null;
  const card = document.getElementById('map-infocard');
  document.getElementById('mic-type').textContent = shop.type;
  document.getElementById('mic-name').textContent = shop.name;
  document.getElementById('mic-sub').textContent = shop.address;
  document.getElementById('mic-crowd-row').style.display = 'none';
  const statusEl = document.getElementById('mic-status');
  statusEl.textContent = open ? '🟢 Currently Open' : '🔴 Currently Closed';
  statusEl.style.color = open ? '#86efac' : '#fca5a5';
  const btn = document.getElementById('mic-detail-btn');
  btn.textContent = 'Open in Maps →';
  btn.onclick = () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(shop.name+' Dehradun')}`, '_blank');
  card.classList.add('visible');
}

window.closeInfoCard = function() {
  document.getElementById('map-infocard').classList.remove('visible');
  window._mapSelectedPlace = null;
};

// ── Layer toggle ──────────────────────────────────────────────
window.toggleLayer = function(layerName) {
  if(!map) return;
  const visible = document.getElementById(`lt-${layerName}`)?.checked;
  layerVisible[layerName] = visible;
  if(visible) { layers[layerName]?.addTo(map); }
  else { if(layers[layerName]) map.removeLayer(layers[layerName]); }
};

// ── Update markers when hour/weather changes ──────────────────
window.updateMapMarkers = function() {
  renderMapMarkers();
};

// ── Init on DOM ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initMap, 300); // small delay so Leaflet CSS loads
});
