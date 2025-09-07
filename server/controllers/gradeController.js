const Grade = require('../models/gradeModel');

// Create or update grade
exports.recordGrade = async (req, res) => {
  try {
    const { studentId, courseId, assignmentId, quizId, grade, feedback, gradedBy } = req.body;

    const query = { studentId, courseId, ...(assignmentId && { assignmentId }), ...(quizId && { quizId }) };
    const update = { grade, feedback, gradedAt: new Date(), gradedBy };
    const options = { upsert: true, new: true };

    const recorded = await Grade.findOneAndUpdate(query, update, options);

    res.status(200).json({ message: 'Grade recorded', grade: recorded });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record grade' });
  }
};

// Get grades for a student
exports.getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ studentId })
      .populate('courseId', 'title')
      .populate('assignmentId', 'title')
      .populate('quizId', 'title');

    res.status(200).json({ grades });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};
