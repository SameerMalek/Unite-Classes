const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('Course', CourseSchema);
