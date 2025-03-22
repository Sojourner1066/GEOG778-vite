export async function fetchWDcountryCentroids() {
    const query = `
    SELECT ?country ?countryLabel ?iso3166_3 ?coord WHERE {
      ?country wdt:P31 wd:Q3624078;  # Sovereign state
               wdt:P298 ?iso3166_3;   # ISO 3166-1 alpha-3 code
               wdt:P625 ?coord.       # Coordinates

      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`;

    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}