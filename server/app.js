const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const { initDatabase } = require('./models/db');
const authRoutes       = require('./routes/auth');
const listingsRoutes   = require('./routes/listings');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/auth',     authRoutes);
app.use('/api/listings', listingsRoutes);

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/welcome.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Initialize DB connection (non-blocking for serverless)
initDatabase().catch(err => {
  console.error('DB init error:', err.message);
});

// Local dev only — Vercel ignores this
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
