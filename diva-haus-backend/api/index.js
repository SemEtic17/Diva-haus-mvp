import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Added
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js'; // NEW: Import userRoutes
import uploadRoutes from './routes/uploadRoutes.js'; // Day 18: Dedicated upload service

dotenv.config();

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Body parser for JSON requests with increased limit
app.use(cookieParser()); // Added

// Day 19: Serve uploaded files statically (for local storage provider)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.error('MONGO_URI not found. Please add it to your .env file.');
}


// Basic Route
app.get('/', (req, res) => {
  res.send('Diva Haus Backend API is running!');
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes); // NEW: Use userRoutes
app.use('/api/uploads', uploadRoutes); // Day 18: Dedicated upload service

// Health Check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
