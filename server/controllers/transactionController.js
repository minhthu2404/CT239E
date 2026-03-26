const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  const { username, date, category } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Missing username query parameter' });
  }
  try {
    let query = { username };
    if (date) query.date = date;
    if (category) query.category = category;

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
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
};

exports.updateTransaction = async (req, res) => {
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
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }
    res.json({ message: 'Đã xóa giao dịch' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
