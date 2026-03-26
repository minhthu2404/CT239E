const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
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
};

exports.setupBudget = async (req, res) => {
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
};

exports.deleteBudget = async (req, res) => {
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
};
