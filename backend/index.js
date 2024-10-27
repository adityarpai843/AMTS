const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const signalRoutes = require('./routes/signal');
require('dotenv').config();

app.use(express.json());
app.disable('x-powered-by');
app.use(cors());

app.use('/api/v1', userRoutes);
app.use('/api/v1', locationRoutes);
app.use('/api/v1', signalRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});