// server.js — Express backend + Vite build (Express v5 safe)

// 1) Env
require('dotenv').config();

// 2) Imports
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// 3) App + middleware
const app = express();
app.use(express.json());

// CORS: allow your frontend; change CORS_ORIGIN in .env if needed
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
    credentials: true,
  })
);

// 4) API routes (keep/add your routes here)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/movies', require('./routes/movies'));
// add more API routes ABOVE the frontend fallback

// 5) Serve the built frontend
const distDir = path.resolve(__dirname, '../pulse-frontend/dist');
app.use(express.static(distDir));

// Express v5-safe SPA fallback: avoid wildcard patterns entirely
app.use((req, res, next) => {
  // Only handle non-API GET requests
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distDir, 'index.html'));
  }
  next();
});

// 6) DB connect, then start server
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

function start() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB');
      start();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      // Still start the server so you can see errors in the browser/logs
      start();
    });
} else {
  console.warn('No MONGO_URI/MONGODB_URI found. Starting without DB.');
  start();
}
