const mongoose = require('mongoose');
const User = require('./User');

const OrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  products: {
    type: [
      {
        productId: [mongoose.Types.ObjectId],
        quantity: Number,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model('order', OrderSchema);
