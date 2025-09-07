const express = require('express');
const router = express.Router();

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,               // <-- Add this
  getQuizSubmissions        // <-- Add this
} = require('../controllers/quizController');

// Routes
router.post('/', createQuiz);                    // POST /api/quizzes
router.get('/', getAllQuizzes);                  // GET /api/quizzes
router.get('/:id', getQuizById);                 // GET /api/quizzes/:id

router.post('/:id/submit', submitQuiz);          // POST /api/quizzes/:id/submit
router.get('/:id/submissions', getQuizSubmissions); // GET /api/quizzes/:id/submissions

module.exports = router;
