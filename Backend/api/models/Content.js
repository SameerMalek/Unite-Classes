const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  type: { type: String, required: true }, // e.g., "Notes", "Tests", etc.
  title: { type: String, required: true },
  data: { type: String, required: true }, // URL, text, or other content
});

module.exports = mongoose.model('Content', ContentSchema);
