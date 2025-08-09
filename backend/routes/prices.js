const express = require('express');
const router = express.Router();
const Price = require('../models/Price');

router.get('/:productId', async (req, res) => {
  try {
    const prices = await Price.find({ productId: req.params.productId }).sort({ checkedAt: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
