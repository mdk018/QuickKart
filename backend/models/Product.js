const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  title: String,
  url: String,
  targetPrice: Number,
  userEmail: String,
});
module.exports = mongoose.model('Product', ProductSchema);
