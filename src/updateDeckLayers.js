// updateDeckLayers.js
import { MapView } from '@deck.gl/core';
import { ArcLayer } from '@deck.gl/layers';
import { Deck } from '@deck.gl/core';

export function updateDeckLayer(deck, countryCentroids, selectedCountries, selectedCountryISO3) {
    // Create a new ArcLayer
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

    // Update the Deck instance with the new layer
    deck.setProps({
        layers: [arcLayer] // Replace any existing layers with the new ArcLayer
    });
}