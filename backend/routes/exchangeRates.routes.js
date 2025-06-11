// routes/exchangeRates.routes.js
const express = require('express');
const router = express.Router();
const exchangeRatesController = require('../controllers/exchangeRates.controller');

router.get('/', exchangeRatesController.getExchangeRates);
router.get('/convert', exchangeRatesController.convertCurrency); // NEW: conversion endpoint

module.exports = router;
