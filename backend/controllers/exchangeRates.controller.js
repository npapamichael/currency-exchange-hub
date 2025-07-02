// controllers/exchangeRates.controller.js
const axios = require('axios');
const redisClient = require('../redisClient');
const { fetchCurrencyApiRates } = require('../services/currencyApi.service');

const CACHE_KEY = 'latest_exchange_rates';
const CACHE_TTL = 60; // seconds

exports.getExchangeRates = async (req, res) => {
  try {
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cached));
    }

    // Try primary API (exchangerate.host)
    const primaryUrl = `https://api.exchangerate.host/latest?base=USD`;
    console.log('Calling primary API:', primaryUrl);

    let response;
    try {
      response = await axios.get(primaryUrl);
    } catch (err) {
      console.warn('Primary API failed:', err.message);
    }

    let data = response?.data;

    if (!data || !data.rates || typeof data.rates !== 'object') {
      console.warn('Primary returned invalid. Switching to fallback...');

      const fallback = await fetchCurrencyApiRates('USD');
      if (!fallback || !fallback.rates) {
        return res.status(500).json({ error: 'Both APIs failed' });
      }

      data = {
        base: fallback.base,
        rates: fallback.rates,
        source: 'currencyapi'
      };
    } else {
      data.source = 'exchangerate.host';
    }

    // Cache and return
    await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    res.json(data);

  } catch (err) {
    console.error('getExchangeRates fatal error:', err.message);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};

exports.convertCurrency = async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing from, to, or amount parameters' });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid amount provided' });
  }

  const cacheKey = `latest_exchange_rates_${from.toUpperCase()}`;

  try {
    let ratesData;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      ratesData = JSON.parse(cached);
    } else {
      // Try primary API
      let response;
      try {
        response = await axios.get(`https://api.exchangerate.host/latest?base=${from}`);
      } catch (err) {
        console.warn('Primary API failed:', err.message);
      }

      if (response?.data?.rates) {
        ratesData = response.data;
      } else {
        // Try fallback
        const fallback = await fetchCurrencyApiRates(from.toUpperCase());
        if (!fallback || !fallback.rates) {
          return res.status(500).json({ error: 'Both APIs failed' });
        }
        ratesData = {
          base: fallback.base,
          rates: fallback.rates,
          source: 'currencyapi'
        };
      }

      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(ratesData));
    }

    const rate = ratesData?.rates?.[to.toUpperCase()];
    if (!rate) {
      return res.status(400).json({ error: `Unsupported target currency: ${to}` });
    }

    const converted = parsedAmount * rate;

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate,
      amount: parsedAmount,
      converted
    });

  } catch (err) {
    console.error('convertCurrency error:', err.message);
    res.status(500).json({ error: 'Conversion failed' });
  }
};


