const express = require('express');
const app = express();
require('dotenv').config();




const integrationRoutes = require('./routes/integrations.routes');
const exchangeRatesRoutes = require('./routes/exchangeRates.routes'); // ✅ New route

app.use(express.json());

// Mount your existing and new routes
app.use('/api/integrations', integrationRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes); // ✅ New route mount

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
