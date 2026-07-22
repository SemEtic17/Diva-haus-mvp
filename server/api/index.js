import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Added
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST, before importing any routes that might use them
dotenv.config();

// Verify storage configuration (concise)
if (process.env.NODE_ENV !== 'production') {
  console.log(`[Server] Storage Provider: ${process.env.STORAGE_PROVIDER || 'local'}`);
}

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js'; // NEW: Import userRoutes
import uploadRoutes from './routes/uploadRoutes.js'; // Day 18: Dedicated upload service
import settingsRoutes from './routes/settingsRoutes.js';
import { listProviders, healthCheck } from './controllers/aiController.js';

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Body parser for JSON requests with increased limit
app.use(cookieParser()); // Added

// Day 19: Serve uploaded files statically (for local storage provider)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Proxy IMG.LY's background-removal assets through the backend. Some browsers
// receive ERR_HTTP2_SERVER_REFUSED_STREAM from staticimgly.com, while the
// server can fetch the same immutable assets over its normal HTTP client.
app.get('/api/imgly-assets/:asset', async (req, res, next) => {
  try {
    const { asset } = req.params;
    if (!/^[a-f0-9]+$/.test(asset)) {
      return res.status(400).send('Invalid IMG.LY asset');
    }
    const assetUrl = `https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/${asset}`;
    const assetResponse = await fetch(assetUrl);

    if (!assetResponse.ok) {
      return res.status(assetResponse.status).send('Unable to fetch IMG.LY asset');
    }

    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.type(assetResponse.headers.get('content-type') || 'application/octet-stream');
    res.send(Buffer.from(await assetResponse.arrayBuffer()));
  } catch (error) {
    next(error);
  }
});

if (MONGO_URI) {
  // If URI contains <PASSWORD> placeholder, try to replace it
  const connectionString = MONGO_URI.includes('<PASSWORD>') && process.env.MONGO_PASSWORD
    ? MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD)
    : MONGO_URI;

  mongoose.connect(connectionString)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error details:');
      console.error(err.message);
    });
} else {
    console.error('MONGO_URI not found. Please add it to your environment variables.');
}


// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes); // NEW: Use userRoutes
app.use('/api/uploads', uploadRoutes); // Day 18: Dedicated upload service
app.use('/api/settings', settingsRoutes);

// AI diagnostics
app.get('/api/ai/providers', listProviders);
app.get('/api/ai/health', healthCheck);

// Health Check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  // Fallback to index.html for client-side routing
  // Note: Express 5 requires a name for wildcards, so we use *path
  app.get('*path', (req, res) => {
    // Only serve index.html if the request is not for an API or upload
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

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
