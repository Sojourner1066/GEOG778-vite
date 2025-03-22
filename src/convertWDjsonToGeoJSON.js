const wdJSONtoGeoJSON = (data) => {
    // Convert SPARQL JSON to GeoJSON
    const geoJSON = {
    type: "FeatureCollection",
    features: data.results.bindings.map(item => {
        // Extract latitude and longitude from 'Point(LONG LAT)'
        const match = item.coord.value.match(/Point\(([^ ]+) ([^ ]+)\)/);
        if (!match) return null; // Skip if coordinates are missing

        const [_, lon, lat] = match.map(Number);

        return {
            type: "Feature",
            properties: {
                name: item.countryLabel.value,
                iso3166_3: item.iso3166_3.value
            },
            geometry: {
                type: "Point",
                coordinates: [lon, lat]
            }
        };
    }).filter(feature => feature !== null) // Remove any invalid entries
};
return geoJSON;
}