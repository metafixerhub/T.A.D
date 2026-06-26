require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';
mongoose.connect(MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Basic Routes
app.get('/api/teachers', (req, res) => {
  res.json([
    { id: 1, name: 'Alice Smith', subject: 'Advanced Mathematics' },
    { id: 2, name: 'Bob Jones', subject: 'Cybersecurity' }
  ]);
});

app.get('/api/recordings', (req, res) => {
  res.json([
    { id: 1, title: 'Intro to Matrices', duration: '45 mins' },
    { id: 2, title: 'Network Defense Basics', duration: '60 mins' }
  ]);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Placeholder authentication logic
  if (username && password) {
    res.json({ success: true, message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
