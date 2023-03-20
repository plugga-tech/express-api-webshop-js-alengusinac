const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  lager: Number,
});

module.exports = mongoose.model('product', ProductSchema);
