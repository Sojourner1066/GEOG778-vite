// function updateStartingPoint(iso3) {
//     startingPoint = getCoordinatesByISO3(iso3);
//     console.log("Updated Starting Point:", startingPoint);
//     updateDeckLayer(map, countryCentroids, selectedCountries, startingPoint)
//   }

export function getCoordinatesByISO3(countryCentroids,iso3) {
      for (let feature of countryCentroids.features) {
          if (feature.properties.iso3166_3 === iso3) {
              return feature.geometry.coordinates;
          }
      }
      return null; // If no matching ISO3 code found
  }