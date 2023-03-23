const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  lager: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('product', ProductSchema);
