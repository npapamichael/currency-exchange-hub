const express = require('express');
const router = express.Router();
const exchangeRatesController = require('../controllers/exchangeRates.controller');
const { fetchCurrencyApiRates } = require('../services/currencyApi.service'); 

router.get('/', exchangeRatesController.getExchangeRates);
router.get('/convert', exchangeRatesController.convertCurrency);


// Currency API
router.get('/currencyapi', async (req, res) => {
  const base = req.query.base || 'USD';
  const result = await fetchCurrencyApiRates(base);

  if (!result) {
    return res.status(500).json({ error: 'CurrencyAPI failed to respond' });
  }

  res.json(result);
});

module.exports = router;
