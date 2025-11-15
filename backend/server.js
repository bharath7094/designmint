// backend/server.js (safe, production-ready - copy & paste)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config(); // optional: reads .env in development

const app = express();
mongoose.set('strictQuery', false);

// Use MONGO_URI from env if available, otherwise local MongoDB
const MONGO = process.env.MONGO_URI;


mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Serve static frontend files from backend/public (if present)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Schema / Model
const ContactModel = mongoose.model('Contact', {
  name: String,
  email: String,
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

// POST /contact - save contact form data
app.post('/contact', async (req, res) => {
  try {
    const newContact = new ContactModel(req.body);
    await newContact.save();
    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, error: 'Failed to save' });
  }
});

// Optional admin route (returns JSON list of contacts).
// Protected by x-admin-token header matching ADMIN_TOKEN env var (set in .env when needed).
app.get('/admin/contacts', async (req, res) => {
  const token = req.header('x-admin-token');
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const items = await ContactModel.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// SAFER SPA fallback middleware:
// If public/index.html exists, serve it for any request not handled earlier.
// This avoids passing a pattern string to Express route parser and prevents
// the path-to-regexp startup crash.
app.use((req, res, next) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
