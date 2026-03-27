const { callOllama } = require('./ollamaService');
const { normalizeAmountText } = require('../utils/amountParser');
const { normalizeCategory } = require('../utils/categoryMapper');
const { normalizeDate, getTodayString } = require('../utils/dateParser');

async function parseTransactionNote(note) {
    const systemPrompt = `
Bạn là AI chuyên phân tích ghi chú giao dịch tài chính.

Nhiệm vụ:
- Đọc ghi chú tiếng Việt của người dùng.
- Trích xuất 4 trường:
  1. type
  2. category
  3. amount
  4. date

Quy tắc:
- Chỉ trả về JSON thuần.
- Không thêm giải thích.
- Không dùng markdown.
- type chỉ được là "income" hoặc "expense".
- category chỉ được là một trong các giá trị:
  "food", "movement", "shopping", "entertainment", "health", "education", "house", "gift", "income"
- amount phải là số nguyên dương.
- date phải theo định dạng YYYY-MM-DD.
- Nếu ghi chú là tiền lương, thưởng, tiền nhận được -> type = "income", category = "income".
- Nếu ghi chú là mua đồ ăn, nước, cơm, bánh, cà phê -> category = "food".
- Nếu không thấy ngày cụ thể thì dùng ngày hôm nay là ${getTodayString()}.

Cách đọc số tiền viết tắt tiếng Việt:
- "k" hoặc "nghìn" = × 1.000  (25k = 25.000)
- "tr" hoặc "triệu" = × 1.000.000  (2tr = 2.000.000)
- Số ghép: <số><đơn vị><chữ số lẻ>:
  3tr8  = 3.800.000  (KHÔNG phải 38.000.000)
  1tr5  = 1.500.000
  5tr50 = 5.500.000
  2k5   = 2.500

Ví dụ:
Input: hôm nay mua nước 10k
Output:
{"type":"expense","category":"food","amount":10000,"date":"${getTodayString()}"}

Input: lương tháng này 8 triệu
Output:
{"type":"income","category":"income","amount":8000000,"date":"${getTodayString()}"}

Input: mua áo 250k ngày 20/03/2026
Output:
{"type":"expense","category":"shopping","amount":250000,"date":"2026-03-20"}

Input: mua đồ 3tr8
Output:
{"type":"expense","category":"shopping","amount":3800000,"date":"${getTodayString()}"}

Input: ăn tối 1tr2 hôm nay
Output:
{"type":"expense","category":"food","amount":1200000,"date":"${getTodayString()}"}
`;

    const userPrompt = `Ghi chú: ${note}`;

    const raw = await callOllama([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ]);

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        throw new Error(`AI trả về không phải JSON hợp lệ: ${raw}`);
    }

    return {
        type: parsed.type === 'income' ? 'income' : 'expense',
        category: normalizeCategory(parsed.category, parsed.type),
        amount: typeof parsed.amount === 'number'
            ? parsed.amount
            : normalizeAmountText(String(parsed.amount || '')),
        date: normalizeDate(parsed.date),
        note
    };
}

module.exports = { parseTransactionNote };