const mongoose = require('mongoose');
const User = require('./User');

const OrderSchema = mongoose.Schema({
  user: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model('order', OrderSchema);
