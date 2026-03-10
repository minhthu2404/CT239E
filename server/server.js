const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Budget = require('./models/Budget');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// NOTE: Thay đổi chuỗi kết nối này nếu dùng MongoDB Atlas hoặc có cấu hình khác
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
  const { username, date, category, note } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Missing username query parameter' });
  }
  try {
    let query = { username };

    if (date) {
      query.date = date;
    }
    if (category) {
      query.category = category;
    }
    // Remove backend note filter so frontend can filter by both note and category name
    // if (note) {
    //   query.note = { $regex: note, $options: 'i' };
    // }

    const transactions = await Transaction.find(query).sort({ date: -1 });
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
    username: req.body.username
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật 1 giao dịch
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        type: req.body.type,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category,
        note: req.body.note,
      },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa 1 giao dịch
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }
    res.json({ message: 'Đã xóa giao dịch' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy danh sách ngân sách
app.get('/api/budgets', async (req, res) => {
  const { username, month } = req.query;
  if (!username || !month) {
    return res.status(400).json({ message: 'Missing username or month query parameter' });
  }
  try {
    const budgets = await Budget.find({ username, month });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thiết lập/Cập nhật ngân sách
app.post('/api/budgets', async (req, res) => {
  const { username, category, month, amount } = req.body;
  if (!username || !category || !month || amount === undefined) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin' });
  }

  try {
    let budget = await Budget.findOne({ username, category, month });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = new Budget({ username, category, month, amount });
      await budget.save();
    }
    res.status(200).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa ngân sách
app.delete('/api/budgets', async (req, res) => {
  const { username, category, month } = req.query;
  if (!username || !category || !month) {
    return res.status(400).json({ message: 'Missing username, category or month query parameter' });
  }
  try {
    const deletedBudget = await Budget.findOneAndDelete({ username, category, month });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }
    res.json({ message: 'Đã xóa ngân sách' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
