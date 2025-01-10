const Class = require('../models/Class');
const Course = require('../models/Course');
const Content = require('../models/Content');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { classId } = req.params;
    const courses = await Course.find({ classId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const content = await Content.find({ courseId });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { chapter, type, data } = req.body;

    const newContent = new Content({ courseId, chapter, type, data });
    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
