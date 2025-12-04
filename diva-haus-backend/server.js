require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON requests

// Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log("MongoDB not connected (no URI yet)");
}


// Basic Route
app.get('/', (req, res) => {
  res.send('Diva Haus Backend API is running!');
});

// Example API route (you'll add more later)
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Sample Product 1', price: 29.99 },
    { id: 2, name: 'Sample Product 2', price: 49.99 },
  ]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
