const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.chat = async (req, res) => {
    const { prompt, username } = req.body;
    try {
        let query = {};
        if (username) query.username = username;
        
        const budgets = await Budget.find(query);
        const transactions = await Transaction.find(query);

        const contextData = [
            ...budgets.map(b => `- Ngân sách: ${b.category} (${b.month}) - Số tiền: ${b.amount}`),
            ...transactions.map(t => `- Giao dịch: ${t.type} ${t.amount} cho ${t.category} vào ngày ${t.date} (${t.note || 'Không có mô tả'})`)
        ];
        const context = contextData.join('\n');

        const systemPrompt = `Bạn là trợ lý tài chính của ứng dụng SpendWise. Phong cách: thân thiện, gọn gàng, ấm áp.

                              [QUY TẮC ĐỊNH DẠNG]
                              1. CHỈ SỬ DỤNG TEXT THUẦN (Plain text). TUYỆT ĐỐI KHÔNG dùng *, **, #.
                              2. PHẢI CÓ 1 dòng trống giữa Tiêu đề và Danh sách.
                              3. Mỗi mục chi tiêu nằm trên 1 dòng, bắt đầu bằng dấu "- ".
                              4. Tên danh mục (Food, Shopping, Movement...) PHẢI dịch sang tiếng Việt (Ăn uống, Mua sắm, Đi lại...).
                              5. KHÔNG dùng từ ngữ rào đón (như "Theo tôi", "Chắc chắn rồi", v.v.).

                              [MẪU TRẢ LỜI CHUẨN - HÃY BẮT CHƯỚC Y HỆT ĐỊNH DẠNG NÀY]

                              Người dùng: Chào bạn
                              Chatbot: Chào bạn nha! 😊 Hôm nay bạn cần mình giúp gì về chi tiêu nào?

                              Người dùng: Báo cáo chi tiêu tháng 4 giúp mình
                              Chatbot: Chi tiêu tháng 4/2025

                              - Ăn uống: 480.000đ
                              - Mua sắm: 1.200.000đ
                              - Đi lại: 320.000đ
                              - Giải trí: 850.000đ

                              Tổng cộng: 2.850.000đ

                              Người dùng: Danh mục nào chiếm số tiền lớn nhất trong tháng 4/2025?
                              Chatbot: Danh mục chiếm số tiền lớn nhất là Mua sắm (1.200.000đ)

                              Người dùng: Tổng thu nhập trong năm 2026 là bao nhiêu?
                              Chatbot: Tổng thu nhập năm 2026

                              - Lương: 10.000.000đ
                              - Thưởng: 3.000.000đ

                              Tổng cộng: 13.000.000đ

                              [DỮ LIỆU TÀI CHÍNH CỦA NGƯỜI DÙNG]
                              ${context}

                              Dựa vào dữ liệu trên và ĐÚNG định dạng mẫu, hãy trả lời câu hỏi sau của người dùng.`;

        // Ollama Endpoint
        const apiUrl = `${process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'}/api/chat`;

        const payload = {
            model: process.env.AI_MODEL || 'llama3:latest',
            messages: [
                { role: 'system', content: systemPrompt }, // Tách riêng luật lệ hệ thống
                { role: 'user', content: prompt }          // Câu hỏi thực tế của người dùng
            ],
            stream: false
        };

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        const response = await fetch(apiUrl, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ollama Native format
        const botResponse = data.message ? data.message.content : data.response;

        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error calling AI service:', error.message);
        res.status(500).json({ message: 'Error communicating with AI service' });
    }
};
