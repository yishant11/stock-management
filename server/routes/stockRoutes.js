const express = require('express');
const router = express.Router();
const { getStockData } = require('../controllers/productController');

// Stock data endpoint
router.get('/getStockData', getStockData);

module.exports = router;
