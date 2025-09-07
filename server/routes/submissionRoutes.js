const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission, // ✅ make sure it's imported
} = require('../controllers/submissionController');

// 📌 Routes
router.post('/:assignmentId', submitAssignment);                      // Submit assignment
router.get('/assignment/:assignmentId', getSubmissionsByAssignment); // Get submissions by assignment
router.put('/:id/grade', gradeSubmission);                            // ✅ Grade submission

module.exports = router;
