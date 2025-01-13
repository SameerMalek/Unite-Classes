const express = require('express');
const { getClasses, getSubjects, getContent } = require('../controllers/classesController');

const router = express.Router();

router.get('/', getClasses); // Fetch all classes
router.get('/:classId/subjects', getSubjects); // Fetch subjects for a class
router.get('/:classId/subjects/:subjectName/categories/:categoryType', getContent); // Fetch files for a category

module.exports = router;
