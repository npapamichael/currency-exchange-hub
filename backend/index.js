const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();




const integrationRoutes = require('./routes/integrations.routes');
const exchangeRatesRoutes = require('./routes/exchangeRates.routes');

app.use(cors());
app.use(express.json());

// Mount your existing and new routes
app.use('/api/integrations', integrationRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes); 



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
