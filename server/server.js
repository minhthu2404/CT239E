const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route definitions
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Mount routes
// Auth routes cover /api/register, /api/login, /api/user/:username
app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/chat', chatRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
