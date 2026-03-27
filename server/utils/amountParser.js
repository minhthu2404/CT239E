/**
 * Phân tích chuỗi số tiền dạng tiếng Việt thành số nguyên.
 * Hỗ trợ: 10k, 25k, 2tr, 1.5tr, 3tr8, 5tr50, 2k5, v.v.
 *
 * Quy tắc số ghép (VD: 3tr8):
 *   - Phần lẻ 1 chữ số sau "tr/triệu" → nhân 100.000 (3tr8 = 3.800.000)
 *   - Phần lẻ 2 chữ số sau "tr/triệu" → nhân 10.000  (3tr80 = 3.800.000)
 *   - Phần lẻ 3+ chữ số sau "tr/triệu" → nhân 1.000   (3tr800 = 3.800.000)
 *   - Phần lẻ 1 chữ số sau "k/nghìn"   → nhân 100     (5k8 = 5.800)
 *   - Phần lẻ 2+ chữ số sau "k/nghìn"  → nhân 10      (5k80 = 5.800)
 */
function normalizeAmountText(text = '') {
    let str = text.toLowerCase().trim().replace(/\s+/g, ' ');

    // Chuỗi toàn số → trả về ngay
    if (/^\d+$/.test(str)) return Number(str);

    // Số ghép: <sốnguyên><đơnvị><sốlẻ>  VD: 3tr8, 1tr5, 2k5, 5tr50
    const compoundMatch = str.match(/^(\d+[.,]?\d*)\s*(tr|triệu)\s*(\d+)$/i)
        || str.match(/^(\d+[.,]?\d*)\s*(k|nghìn|ngàn)\s*(\d+)$/i);

    if (compoundMatch) {
        const main = parseFloat(compoundMatch[1].replace(',', '.'));
        const unit = compoundMatch[2].toLowerCase();
        const remainder = compoundMatch[3];

        const isTr = unit === 'tr' || unit === 'triệu';
        const baseValue = isTr ? main * 1_000_000 : main * 1_000;

        let remainderValue = 0;
        if (isTr) {
            // Phần lẻ sau triệu: 1 chữ số→×100k, 2 chữ số→×10k, 3+ chữ số→×1k
            const multiplier = remainder.length === 1 ? 100_000
                : remainder.length === 2 ? 10_000
                : 1_000;
            remainderValue = parseInt(remainder, 10) * multiplier;
        } else {
            // Phần lẻ sau k: 1 chữ số→×100, 2+→×10
            const multiplier = remainder.length === 1 ? 100 : 10;
            remainderValue = parseInt(remainder, 10) * multiplier;
        }

        return Math.round(baseValue + remainderValue);
    }

    // Số đơn kiểu: 10k, 2.5tr, 250k, 8 triệu
    const simpleMatch = str.match(/^(\d+[.,]?\d*)\s*(k|nghìn|ngàn|tr|triệu)?$/i);
    if (!simpleMatch) return null;

    let value = parseFloat(simpleMatch[1].replace(',', '.'));
    const unit = (simpleMatch[2] || '').toLowerCase();

    if (unit === 'k' || unit === 'nghìn' || unit === 'ngàn') {
        value *= 1_000;
    } else if (unit === 'tr' || unit === 'triệu') {
        value *= 1_000_000;
    }

    return Math.round(value);
}

module.exports = { normalizeAmountText };