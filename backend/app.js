const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { startCronJob } = require('./scheduler');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    startCronJob();  // Start the scheduler after DB connected
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// your routes here
const productRoutes = require('./routes/products');
const priceRoutes = require('./routes/prices');
app.use('/api/products', productRoutes);
app.use('/api/prices', priceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
