const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    month: {
        type: String, // Format 'YYYY-MM'
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);
