function normalizeCategory(rawCategory = '', rawType = '') {
    const category = rawCategory.toLowerCase().trim();
    const type = rawType.toLowerCase().trim();

    const map = {
        // Thu nhập
        salary: 'salary',
        'lương': 'salary',
        bonus: 'bonus',
        'thưởng': 'bonus',
        interest: 'interest',
        'lãi suất': 'interest',
        sale: 'sale',
        'bán đồ': 'sale',
        other_thu: 'other_thu',
        'thu nhập khác': 'other_thu',
        income: 'other_thu',
        'thu nhập': 'other_thu',

        // Chi tiêu
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
        entertaiment: 'entertainment',
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

        other_chi: 'other_chi',
        'chi tiêu khác': 'other_chi'
    };

    if (map[category]) {
        return map[category];
    }

    return type === 'income' ? 'other_thu' : 'food';
}

module.exports = { normalizeCategory };