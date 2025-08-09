const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Price = require('../models/Price');  // add this import to delete price history


// Create new product (existing)
router.post('/', async (req, res) => {
  try {
    const { title, url, targetPrice, userEmail } = req.body;
    const product = new Product({ title, url, targetPrice, userEmail });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products (existing)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product by ID - new route to remove tracking
router.delete('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Delete the product document
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all related prices for the product
    await Price.deleteMany({ productId });

    res.json({ message: 'Product removed from tracking successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to remove product' });
  }
});

module.exports = router;
