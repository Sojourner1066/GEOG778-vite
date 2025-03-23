import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ScatterplotLayer } from '@deck.gl/layers';
import { Deck } from '@deck.gl/core';
import 'deck.gl-leaflet'; // extends L with L.DeckGL


import { fetchWDcountryCentroids } from './wdGetCountryCentroid.js';
import { wdJSONtoGeoJSON } from './convertWDjsonToGeoJSON.js';
import { filterGeoJSONByISO3 } from './filterCentroidsByISO.js';


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

// import mapbox token
const mapboxToken =
  import.meta.env.VITE_MAPBOX_TOKEN || window?.config?.MAPBOX_TOKEN;

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
tileSize: 512,
zoomOffset: -1,
}).addTo(map);


let countryCentroids = null; // Global cache for centroids

// Fetch once on load
fetchWDcountryCentroids()
  .then(data => {
    countryCentroids = wdJSONtoGeoJSON(data);
    console.log("Fetched centroids once:", countryCentroids);
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
          const clickedFeature = e.target.feature; // <- Safely get the feature from the layer
          const iso3 = clickedFeature.properties.adm0_a3_us;
          console.log("Selected Country ISO3:", iso3);
          e.target.setStyle(selectedStyle); // Apply selected style 
          const primaryCountry = filterGeoJSONByISO3(countryCentroids, iso3);
          console.log("Primary Country:", primaryCountry);       
      }
  });
}

