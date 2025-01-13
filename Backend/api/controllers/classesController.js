import { find, findById, findOne } from '../models/Class';

export async function getClasses(req, res) {
  try {
    const classes = await find({}, 'className'); // Fetch only className and _id
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching classes', details: err.message });
  }
}

export async function getSubjects(req, res) {
  try {
    const { classId } = req.params;
    const classData = await findById(classId, 'subjects');
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData.subjects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching subjects', details: err.message });
  }
}

export async function getContent(req, res) {
  try {
    const { classId, subjectName, categoryType } = req.params;

    const classData = await findOne(
      { _id: classId, 'subjects.name': subjectName },
      { 'subjects.$': 1 } // Fetch only the matching subject
    );

    if (!classData || classData.subjects.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const subject = classData.subjects[0];
    const category = subject.categories.find((cat) => cat.type === categoryType);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category.files);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content', details: err.message });
  }
}
