const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  className: { type: String, required: true }, // Use className instead of name
});

module.exports = mongoose.model('Class', ClassSchema);