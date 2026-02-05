const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// NOTE: Thay đổi chuỗi kết nối này nếu bạn dùng MongoDB Atlas hoặc có cấu hình khác
const mongoURI = 'mongodb://localhost:27017/spendwise';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Đăng ký
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validation cơ bản
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã tồn tại' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công', user: { username: newUser.username, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // In a real app, use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    res.json({ message: 'Đăng nhập thành công', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy thông tin user
app.get('/api/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy danh sách giao dịch
app.get('/api/transactions', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Missing username query parameter' });
  }
  try {
    const transactions = await Transaction.find({ username }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo 1 giao dịch mới
app.post('/api/transactions', async (req, res) => {
  const transaction = new Transaction({
    type: req.body.type,
    amount: req.body.amount,
    date: req.body.date,
    category: req.body.category,
    note: req.body.note,
    username: req.body.username // Save username
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
