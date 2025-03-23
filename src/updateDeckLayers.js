// updateDeckLayers.js
import { MapView } from '@deck.gl/core';
import { ArcLayer } from '@deck.gl/layers';
import { Deck } from '@deck.gl/core';

export function updateDeckLayer(map, countryCentroids, selectedCountries, selectedCountryISO3) {
    // Remove existing deck.gl layers
    map.eachLayer(layer => {
        if (layer._isDeckLayer) {
            map.removeLayer(layer);
        }
    });

    // Create a new deck.gl ArcLayer
    const arcLayer = new ArcLayer({
        id: 'arcs',
        data: countryCentroids,
        dataTransform: d => {
            const startingPointFeature = d.features.find(f => f.properties.iso3166_3 === selectedCountryISO3);
            const startingPoint = startingPointFeature ? startingPointFeature.geometry.coordinates : null;
            return d.features
                .filter(f => selectedCountries.includes(f.properties.iso3166_3))
                .map(f => ({
                    ...f,
                    sourcePosition: startingPoint,
                    targetPosition: f.geometry.coordinates
                }));
        },
        // Styles
        getSourcePosition: f => f.sourcePosition,
        getTargetPosition: f => f.targetPosition,
        getSourceColor: [0, 128, 200],
        getTargetColor: [200, 0, 80],
        getWidth: 1
    });

    // Create a custom Leaflet layer for deck.gl
    const deckLayer = L.layerGroup(); // Create an empty Leaflet layer group

    const deckInstance = new Deck({
        canvas: 'deck-canvas', // ID of the canvas element
        views: [new MapView({ repeat: true })],
        layers: [arcLayer],
        initialViewState: {
            longitude: 0,
            latitude: 0,
            zoom: 2
        },
        controller: true
    });

    // Add the deck.gl canvas to the map
    const deckCanvas = document.getElementById('deck-canvas');
    if (!deckCanvas) {
        const canvas = document.createElement('canvas');
        canvas.id = 'deck-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        map.getContainer().appendChild(canvas);
    }

    // Add the custom layer to the map
    map.addLayer(deckLayer);

    // Tag the layer for easy removal
    deckLayer._isDeckLayer = true;
}