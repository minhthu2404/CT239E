const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
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
};

exports.login = async (req, res) => {
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
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
