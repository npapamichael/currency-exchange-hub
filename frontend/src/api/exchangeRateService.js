// frontend/src/api/exchangeRateService.js

export async function fetchRates(base = 'USD') {
  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
    if (!response.ok) throw new Error('Failed to fetch rates');
    const data = await response.json();
    console.log("Fetched exchange rates:", data);
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}
