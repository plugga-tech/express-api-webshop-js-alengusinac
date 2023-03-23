const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
});

module.exports = mongoose.model('category', CategorySchema);
