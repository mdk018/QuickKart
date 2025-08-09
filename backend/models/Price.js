const mongoose = require('mongoose');
const PriceSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  price: Number,
  checkedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Price', PriceSchema);
