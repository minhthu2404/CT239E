function normalizeAmountText(text = '') {
    let str = text.toLowerCase().trim();

    str = str.replace(/\s+/g, ' ');

    if (/^\d+$/.test(str)) return Number(str);

    const match = str.match(/(\d+[.,]?\d*)\s*(k|nghìn|ngàn|tr|triệu|m)?/i);
    if (!match) return null;

    let value = parseFloat(match[1].replace(',', '.'));
    const unit = (match[2] || '').toLowerCase();

    if (unit === 'k' || unit === 'nghìn' || unit === 'ngàn') {
        value *= 1000;
    } else if (unit === 'tr' || unit === 'triệu') {
        value *= 1000000;
    }

    return Math.round(value);
}

module.exports = { normalizeAmountText };