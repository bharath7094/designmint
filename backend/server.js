// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// load env from process.env (Render provides these)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Designmint';
const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-placeholder';

const app = express();

// security / helpers
app.use(cors());
app.use(express.json()); // body parser for JSON
app.disable('x-powered-by');

// connect mongoose
mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// simple schema
const ContactModel = mongoose.model('Contact', {
  name: String,
  email: String,
  subject: String,
  createdAt: { type: Date, default: () => new Date() }
});

// API: POST /contact
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject } = req.body;
    if (!name || !email || !subject) {
      return res.status(400).json({ error: 'name, email and subject are required' });
    }
    const doc = new ContactModel({ name, email, subject });
    await doc.save();
    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Error saving contact:', err);
    return res.status(500).json({ error: 'Failed to save' });
  }
});

// Protected admin endpoint to list contacts
app.get('/admin/contacts', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const docs = await ContactModel.find().sort({ createdAt: -1 }).lean();
    return res.json(docs);
  } catch (err) {
    console.error('Admin fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Serve static Angular build from /public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath, { maxAge: '1d' }));

// SPA fallback — serve index.html for all other GET requests
app.get('*', (req, res) => {
  // if request is for api route, skip (already handled above)
  if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path === '/contact') {
    return res.status(404).json({ error: 'Not found' });
  }
  return res.sendFile(path.join(publicPath, 'index.html'));
});

// start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
