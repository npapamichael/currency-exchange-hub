// services/currencyApi.service.js
const axios = require('axios');
const API_KEY = process.env.CURRENCY_API_KEY;
const BASE_URL = 'https://api.currencyapi.com/v3';

async function fetchCurrencyApiRates(base = 'USD') {
  try {
    const response = await axios.get(`${BASE_URL}/latest`, {
      params: {
        apikey: API_KEY,
        base_currency: base
      }
    });

    const rawRates = response.data?.data;
    const rates = {};

    for (const [code, valueObj] of Object.entries(rawRates)) {
      rates[code] = valueObj.value;
    }

    return {
      base,
      rates
    };
  } catch (err) {
    console.error('CurrencyAPI error:', err.message);
    return null;
  }
}

module.exports = { fetchCurrencyApiRates };
