// TODO: Fix external API handling
// TODO: Fix external API handling
// TODO: Fix external API handling

const axios = require('axios');
const redisClient = require('../redisClient');

const CACHE_KEY = 'latest_exchange_rates';
const CACHE_TTL = 60;

exports.getExchangeRates = async (req, res) => {
  try {
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log('📦 Served from Redis cache');
      return res.json(JSON.parse(cached));
    }

    const apiUrl = `https://api.exchangerate.host/latest?base=USD`;
    console.log('🌍 Calling:', apiUrl);

    const response = await axios.get(apiUrl);
    const data = response.data;

    console.log('🧪 API Response:', JSON.stringify(data, null, 2));

    if (!data || !data.rates || typeof data.rates !== 'object') {
      console.error('❌ Unexpected structure:', JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'Invalid exchange rate data from API' });
    }

    await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error('❌ getExchangeRates error:', err.message);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};

exports.convertCurrency = async (req, res) => {
  res.status(501).json({ error: 'Currency conversion temporarily disabled (pending API fix).' });
};
