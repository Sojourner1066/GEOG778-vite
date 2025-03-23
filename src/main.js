import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ArcLayer } from '@deck.gl/layers';
import { Deck, MapView } from '@deck.gl/core';

import { fetchWDcountryCentroids } from './wdGetCountryCentroid.js';
import { wdJSONtoGeoJSON } from './convertWDjsonToGeoJSON.js';
import { filterGeoJSONByISO3 } from './filterCentroidsByISO.js';
import { getRandomISO3Codes } from './testLinkedCountry.js';
import { updateDeckLayer } from './updateDeckLayers.js';

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

// Import Mapbox token
const mapboxToken =
  import.meta.env.VITE_MAPBOX_TOKEN || window?.config?.MAPBOX_TOKEN;

L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
  attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

// Create a custom canvas for deck.gl
const deckCanvas = document.createElement('canvas');
deckCanvas.id = 'deck-canvas';
deckCanvas.style.position = 'absolute';
deckCanvas.style.top = '0';
deckCanvas.style.left = '0';
deckCanvas.style.width = '100%';
deckCanvas.style.height = '100%';
map.getContainer().appendChild(deckCanvas);

// Initialize the Deck instance
const deck = new Deck({
  canvas: 'deck-canvas',
  views: [new MapView({ repeat: true })],
  layers: [], // Start with an empty array of layers
  initialViewState: {
    longitude: 20.0,
    latitude: 2.5,
    zoom: 3
  },
  controller: true
});

// Global cache for centroids
let countryCentroids = null;

// Fetch centroids once on load
fetchWDcountryCentroids()
  .then(data => {
    countryCentroids = wdJSONtoGeoJSON(data);
  })
  .catch(err => console.error("Error fetching centroids:", err));

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
      // Get the ISO3 code from the clicked country
      const clickedFeature = e.target.feature; // <- Safely get the feature from the layer
      const iso3 = clickedFeature.properties.adm0_a3_us;
      console.log("Selected Country ISO3:", iso3);

      // Apply selected style
      e.target.setStyle(selectedStyle); // Apply selected style 

      // Get an array of random countries for testing
      const randomCountries = getRandomISO3Codes();

      // Update the deck.gl layer
      updateDeckLayer(deck, countryCentroids, randomCountries, iso3);
    }
  });
}