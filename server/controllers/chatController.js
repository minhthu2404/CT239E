const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { callChatAI } = require('../services/chatService');

exports.chat = async (req, res) => {
    const { prompt, username } = req.body;
    try {
        let query = {};
        if (username) query.username = username;

        const budgets = await Budget.find(query);
        const transactions = await Transaction.find(query);

        // Xây dựng context dữ liệu tài chính của người dùng
        const contextData = [
            ...budgets.map(b => `- Ngân sách: ${b.category} (${b.month}) - Số tiền: ${b.amount}`),
            ...transactions.map(t => `- Giao dịch: ${t.type} ${t.amount} cho ${t.category} vào ngày ${t.date} (${t.note || 'Không có mô tả'})`)
        ];
        const context = contextData.join('\n');

        const botResponse = await callChatAI(prompt, context);
        res.json({ response: botResponse });

    } catch (error) {
        console.error('Error calling AI service:', error.message);
        res.status(500).json({ message: 'Error communicating with AI service' });
    }
};
