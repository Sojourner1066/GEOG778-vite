// /src/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
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
  color: "#9e9ac8",
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

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const deckRef = useRef(null);
  const mapRef = useRef(null);
  const countryCentroidsRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Leaflet map
    const map = L.map(mapContainerRef.current).setView([2.5, 20.0], 3);
    mapRef.current = map;

    // Get Mapbox token from env or global config
    const mapboxToken =
      import.meta.env.VITE_MAPBOX_TOKEN || window?.config?.MAPBOX_TOKEN;

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);

    // Create a custom canvas for deck.gl and append it to the map container
    const deckCanvas = document.createElement('canvas');
    deckCanvas.id = 'deck-canvas';
    deckCanvas.style.position = 'absolute';
    deckCanvas.style.top = '0';
    deckCanvas.style.left = '0';
    deckCanvas.style.width = '100%';
    deckCanvas.style.height = '100%';
    map.getContainer().appendChild(deckCanvas);

    // Initialize deck.gl
    const deck = new Deck({
      canvas: 'deck-canvas',
      views: [new MapView({ repeat: true })],
      layers: [],
      initialViewState: {
        longitude: 20.0,
        latitude: 2.5,
        zoom: 3
      },
      controller: true
    });
    deckRef.current = deck;

    // Fetch centroids and convert to GeoJSON
    fetchWDcountryCentroids()
      .then(data => {
        countryCentroidsRef.current = wdJSONtoGeoJSON(data);
      })
      .catch(err => console.error("Error fetching centroids:", err));

    // Load GeoJSON and add it to the map with styles and events
    fetch("/GEOG778-vite/WorldPoly.geojson")
      .then(response => response.json())
      .then(data => {
        L.geoJson(data, {
          style: defaultStyle,
          onEachFeature: onEachFeature
        }).addTo(map);
      })
      .catch(error => console.error("Error loading GeoJSON:", error));

    // Attach event listeners for each feature
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: function (e) {
          e.target.setStyle(hoverStyle);
        },
        mouseout: function (e) {
          e.target.setStyle(defaultStyle);
        },
        click: function (e) {
          const clickedFeature = e.target.feature;
          const iso3 = clickedFeature.properties.adm0_a3_us;
          console.log("Selected Country ISO3:", iso3);

          // Apply selected style
          e.target.setStyle(selectedStyle);

          // Get random ISO3 codes for testing and update the deck.gl layer
          const randomCountries = getRandomISO3Codes();
          updateDeckLayer(deck, countryCentroidsRef.current, randomCountries, iso3);
        }
      });
    }

    // Cleanup function to remove the map when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    />
  );
};

export default MapComponent;