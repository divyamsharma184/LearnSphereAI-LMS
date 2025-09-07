const Quiz = require('../models/quizModel');
const QuizSubmission = require('../models/quizSubmissionModel');


// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error('Create Quiz Error:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('courseId', 'title');
    res.status(200).json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('courseId', 'title');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.status(200).json({ quiz });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};
// Submit a quiz attempt
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, studentId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;
    answers.forEach((ans, index) => {
      const correct = quiz.questions.find(q => q.id === ans.questionId)?.correctAnswer;
      if (ans.selectedAnswer === correct) score += quiz.questions.find(q => q.id === ans.questionId)?.points || 0;
    });

    const passed = score >= quiz.passingScore;

    const submission = await QuizSubmission.create({
      quizId,
      studentId,
      answers,
      score,
      passed
    });

    res.status(201).json({ message: 'Quiz submitted', submission });
  } catch (err) {
    console.error('Submit Error:', err);
    res.status(500).json({ error: 'Quiz submission failed' });
  }
};

// Get all submissions for a quiz
exports.getQuizSubmissions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const submissions = await QuizSubmission.find({ quizId }).populate('studentId', 'name email');
    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};