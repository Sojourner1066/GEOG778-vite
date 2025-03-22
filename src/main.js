import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { LeafletDeckGl } from '@deck.gl/leaflet';

// 1. Initialize Leaflet map
const map = L.map('map').setView([37.7749, -122.4194], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. Create a deck.gl layer (example: points)
const scatterplot = new ScatterplotLayer({
  id: 'scatterplot-layer',
  data: [
    { position: [-122.4194, 37.7749], size: 100 },
    { position: [-122.4294, 37.7849], size: 150 }
  ],
  getPosition: d => d.position,
  getRadius: d => d.size,
  getColor: [255, 0, 0],
  radiusScale: 1,
  pickable: true
});

// 3. Attach deck.gl to Leaflet
new LeafletDeckGl({ layers: [scatterplot] }).addTo(map);
