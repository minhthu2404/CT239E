const express = require('express');
const router = express.Router();
const aiTransactionController = require('../controllers/aiTransactionController');

router.post('/parse-transaction-note', aiTransactionController.parseTransactionNote);

module.exports = router;