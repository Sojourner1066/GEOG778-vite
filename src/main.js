import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ScatterplotLayer } from '@deck.gl/layers';
import { Deck } from '@deck.gl/core';
import 'deck.gl-leaflet'; // extends L with L.DeckGL

const defaultStyle = {
  fillColor: "#cbc9e2", 
  color: "#9e9ac8",       // Border color
  weight: 1,
  fillOpacity: 0.6
};

const hoverStyle = {
  fillColor: "#9e9ac8",
  color: "#9e9ac8",
  weight: 1,
  fillOpacity: 0.8
};

const selectedStyle = {
  fillColor: "#54278f", 
  weight: 1
};

// Initialize the map
let map = L.map('map').setView([2.5, 20.0], 3);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
tileSize: 512,
zoomOffset: -1,
}).addTo(map);

// Fetch and add GeoJSON data
fetch("/GEOG778-vite/WorldPoly.geojson")
.then(response => response.json())
.then(data => {
    L.geoJson(data, {
      style: defaultStyle, // Set default style
      onEachFeature: onEachFeature // Attach event listeners 
    }).addTo(map);
})
.catch(error => console.error("Error loading GeoJSON:", error));

// Event functions to apply and remove styles
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: function (e) {
          e.target.setStyle(hoverStyle); // Apply hover style
      },
      mouseout: function (e) {
          e.target.setStyle(defaultStyle); // Reset to default style
      },
      click: function (e) {
          e.target.setStyle(selectedStyle); // Apply selected style on click
          iso3 = feature.properties.adm0_a3_us;
          console.log("Selected Country ISO3:", iso3);
          // updateStartingPoint(iso3); // Update starting point
      }
  });
}

