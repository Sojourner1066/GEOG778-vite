import { ArcLayer } from '@deck.gl/layers';
import { getCoordinatesByISO3 } from './util';

export function updateDeckLayer(deck, countryCentroids, selectedCountries, selectedCountryISO3) {
  // Get the centerpoint of the clicked country.
  const sourcePosition = getCoordinatesByISO3(countryCentroids, selectedCountryISO3);
  if (!sourcePosition) {
    console.error(`No centerpoint found for clicked country: ${selectedCountryISO3}`);
    return;
  }

  // Build the data array for the ArcLayer.
  // For each country in the selectedCountries array, get its centerpoint.
  const arcData = selectedCountries.map(targetISO3 => {
    const targetPosition = getCoordinatesByISO3(countryCentroids, targetISO3);
    return {
      sourcePosition,
      targetPosition
    };
  }).filter(d => d.targetPosition !== null); // Exclude any countries with no centerpoint.

  // Create a new ArcLayer that connects the clicked country's centerpoint to each target country's centerpoint.
  const arcLayer = new ArcLayer({
    id: 'country-arcs',
    data: arcData,
    getSourcePosition: d => d.sourcePosition,
    getTargetPosition: d => d.targetPosition,
    getSourceColor: [0, 128, 200],  // Blue for source
    getTargetColor: [200, 0, 80],   // Red for target
    getWidth: 2                   // Line width
  });

  // Update the deck instance to remove any existing arc layers and set the new one.
  deck.setProps({
    layers: [arcLayer]
  });
}