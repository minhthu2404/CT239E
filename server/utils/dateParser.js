function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function normalizeDate(rawDate = '') {
    if (!rawDate) return getTodayString();

    const text = rawDate.toLowerCase().trim();

    if (text === 'hôm nay' || text === 'today') {
        return getTodayString();
    }

    const ddmmyyyy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const dd = String(ddmmyyyy[1]).padStart(2, '0');
        const mm = String(ddmmyyyy[2]).padStart(2, '0');
        const yyyy = ddmmyyyy[3];
        return `${yyyy}-${mm}-${dd}`;
    }

    const yyyymmdd = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmdd) return text;

    return getTodayString();
}

module.exports = { normalizeDate, getTodayString };