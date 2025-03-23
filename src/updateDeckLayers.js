// updateDeckLayers.js
import { Deck, MapView } from '@deck.gl/core';
import { ArcLayer } from '@deck.gl/layers';

export function updateDeckLayer(map, countryCentroids, selectedCountries, selectedCountryISO3) {
    // Remove existing deck.gl layers
    // map.eachLayer(layer => {
    //     if (layer instanceof L.DeckGL.Layer) {
    //         map.removeLayer(layer);
    //     }
    // });

    map.eachLayer(layer => {
        if (layer._isDeckLayer) {
          map.removeLayer(layer);
        }
      });

    // Create a new deck.gl layer with updated data
    // const deckLayer = new L.DeckGL({
    //     views: [
    //         new MapView({ repeat: true })
    //     ],
    //     layers: [
    //         new ArcLayer({
    //             id: 'arcs',
    //             data: countryCentroids,
    //             dataTransform: d => {
    //                 const startingPointFeature = d.features.find(f => f.properties.iso3166_3 === selectedCountryISO3);
    //                 const startingPoint = startingPointFeature ? startingPointFeature.geometry.coordinates : null;
    //                 return d.features
    //                     .filter(f => selectedCountries.includes(f.properties.iso3166_3))
    //                     .map(f => ({
    //                         ...f,
    //                         sourcePosition: startingPoint,
    //                         targetPosition: f.geometry.coordinates
    //                     }));
    //             },
    //             // Styles
    //             getSourcePosition: f => f.sourcePosition,
    //             getTargetPosition: f => f.targetPosition,
    //             getSourceColor: [0, 128, 200],
    //             getTargetColor: [200, 0, 80],
    //             getWidth: 1
    //         })
    //     ]
    // });


    const deckLayer = new Deck({
        parent: map.getPanes().overlayPane,
        views: [new MapView({ repeat: true })],
        layers: [new ArcLayer({
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
        })
    ],
        controller: false
      });
    // Add the new layer to the map
    map.addLayer(deckLayer);
}