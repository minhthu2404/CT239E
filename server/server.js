const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Thay thế bodyParser.json() bằng express.json() (hiện đại hơn)

// Cấu hình phục vụ các tệp tĩnh  từ thư mục client
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route definitions (Giữ nguyên phần này)
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const chatRoutes = require('./routes/chatRoutes');
const aiRoutes = require('./routes/aiTransactionRoutes');

// Mount API routes
app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);

// Định nghĩa Route mặc định để khi vào http://localhost:3000 sẽ tự động mở trang chào mừng
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/welcome_page/welcome_spendwise.html'));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server SpendWise đang chạy tại: http://localhost:${PORT}`);
  console.log(`Truy cập giao diện tại: http://localhost:${PORT}/welcome_page/welcome_spendwise.html`);
});