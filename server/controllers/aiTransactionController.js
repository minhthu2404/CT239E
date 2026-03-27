const { parseTransactionNote } = require('../services/transactionParserService');

exports.parseTransactionNote = async (req, res) => {
    try {
        const { note } = req.body;

        if (!note || !note.trim()) {
            return res.status(400).json({
                message: 'Vui lòng nhập ghi chú giao dịch'
            });
        }

        const result = await parseTransactionNote(note);

        if (!result.amount || result.amount <= 0) {
            return res.status(400).json({
                message: 'Không nhận diện được số tiền hợp lệ',
                rawResult: result
            });
        }

        return res.json(result);
    } catch (error) {
        console.error('AI parse transaction error:', error.message);
        return res.status(500).json({
            message: 'Không thể phân tích ghi chú giao dịch bằng AI',
            error: error.message
        });
    }
};