const express = require('express');
const router = express.Router();
const { purchaseProduct } = require('../controllers/transactionController');

// Purchase endpoint
router.post('/purchaseStock', purchaseProduct);

module.exports = router;
