// updateDeckLayers.js
import { MapView } from '@deck.gl/core';
import { ArcLayer } from '@deck.gl/layers';
import { Deck } from '@deck.gl/core';

export function updateDeckLayer(deck, countryCentroids, selectedCountries, selectedCountryISO3) {
    // Create a new ArcLayer
    // Static data for the ArcLayer
    const data = [
      {
        sourcePosition: [-122.41669, 37.7853], // San Francisco
        targetPosition: [-74.006, 40.7128]    // New York City
      },
      {
        sourcePosition: [-74.006, 40.7128],   // New York City
        targetPosition: [2.3522, 48.8566]     // Paris
      }
    ];

    // Create the ArcLayer
    const arcLayer = new ArcLayer({
      id: 'simple-arcs',
      data: data,
      getSourcePosition: d => d.sourcePosition,
      getTargetPosition: d => d.targetPosition,
      getSourceColor: [0, 128, 200], // Blue color for source
      getTargetColor: [200, 0, 80],  // Red color for target
      getWidth: 2                   // Line width
    });

    // const arcLayer = new ArcLayer({
    //     id: 'arcs',
    //     data: countryCentroids,
    //     dataTransform: d => {
    //         const startingPointFeature = d.features.find(f => f.properties.iso3166_3 === selectedCountryISO3);
    //         // const startingPoint = startingPointFeature ? startingPointFeature.geometry.coordinates : null;
    //         // console.log(startingPoint);
    //         return d.features
    //             .filter(f => selectedCountries.includes(f.properties.iso3166_3))
    //             .map(f => ({
    //                 ...f,
    //                 sourcePosition: startingPointFeature.geometry.coordinates,
    //                 targetPosition: f.geometry.coordinates      
    //             }));
    //         console.log("Transformed Data for ArcLayer:", transformedData);
    //     },
    //     // Styles
    //     getSourcePosition: f => f.sourcePosition,
    //     getTargetPosition: f => f.targetPosition,
    //     getSourceColor: [0, 128, 200],
    //     getTargetColor: [200, 0, 80],
    //     getWidth: 1
    // });

    // Update the Deck instance with the new layer
    deck.setProps({
        layers: [arcLayer] // Replace any existing layers with the new ArcLayer
    });
}