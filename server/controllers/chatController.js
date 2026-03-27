const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { buildChatSystemPrompt } = require('../prompts/chatPrompt');

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

        // Lấy system prompt từ module riêng
        const systemPrompt = buildChatSystemPrompt(context);

        // Ollama Endpoint
        const apiUrl = `${process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'}/api/chat`;

        const payload = {
            model: process.env.AI_MODEL || 'gpt-oss:120b-cloud',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            stream: false
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.message ? data.message.content : data.response;
        res.json({ response: botResponse });

    } catch (error) {
        console.error('Error calling AI service:', error.message);
        res.status(500).json({ message: 'Error communicating with AI service' });
    }
};
