const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, // Keep this for referencing the Class model
  name: { type: String, required: true }, 
});

module.exports = mongoose.model('Course', CourseSchema);