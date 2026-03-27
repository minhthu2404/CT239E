function normalizeCategory(rawCategory = '', rawType = '') {
    const category = rawCategory.toLowerCase().trim();
    const type = rawType.toLowerCase().trim();

    if (type === 'income') return 'income';

    const map = {
        food: 'food',
        'ăn uống': 'food',
        an_uong: 'food',

        movement: 'movement',
        'đi lại': 'movement',
        di_lai: 'movement',
        transport: 'movement',

        shopping: 'shopping',
        'mua sắm': 'shopping',
        mua_sam: 'shopping',

        entertainment: 'entertainment',
        'giải trí': 'entertainment',
        giai_tri: 'entertainment',

        health: 'health',
        'sức khỏe': 'health',
        suc_khoe: 'health',

        education: 'education',
        'giáo dục': 'education',
        giao_duc: 'education',

        house: 'house',
        'nhà cửa': 'house',
        nha_cua: 'house',

        gift: 'gift',
        'quà tặng': 'gift',
        qua_tang: 'gift',

        income: 'income',
        'thu nhập': 'income'
    };

    return map[category] || 'food';
}

module.exports = { normalizeCategory };