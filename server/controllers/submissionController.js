const Submission = require('../models/submissionModel');


// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId, textSubmission, files } = req.body;

    const isLate = new Date() > new Date(req.body.dueDate); // Pass dueDate from frontend
    const submission = await Submission.create({
      assignmentId,
      studentId,
      textSubmission,
      files,
      isLate,
    });

    res.status(201).json({ message: 'Submission successful', submission });
  } catch (err) {
    res.status(500).json({ error: 'Error submitting assignment' });
  }
};

// Get all submissions for an assignment
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId }).populate('studentId', 'name email');

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params; // submission ID
    const { grade, feedback, gradedBy } = req.body;

    const updated = await Submission.findByIdAndUpdate(
      id,
      {
        grade,
        feedback,
        status: 'graded',
        gradedAt: new Date(),
        gradedBy,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Submission not found' });

    res.status(200).json({ message: 'Submission graded', updated });
  } catch (err) {
    console.error('Grade Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
