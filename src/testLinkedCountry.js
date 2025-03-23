export function getRandomISO3Codes(count = 8) {
    const shuffled = [...iso3166Alpha3Codes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Example usage:
  const randomCountries = getRandomISO3Codes();
  console.log("Random ISO3 codes:", randomCountries);