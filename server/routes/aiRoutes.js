const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// AI Tutor Routes
router.post('/ask-question', aiController.askQuestion);
router.get('/chat-history/:courseId', aiController.getChatHistory);
router.get('/status/:courseId', aiController.getCourseAIStatus);

// Document Upload Routes
router.post('/upload-documents/:courseId', 
  aiController.uploadMiddleware, 
  aiController.uploadDocuments
);

// Quiz Generation Routes
router.post('/generate-quiz/:courseId', aiController.generateQuiz);
router.post('/save-quiz/:courseId', aiController.saveGeneratedQuiz);

module.exports = router;
