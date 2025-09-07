const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      selectedAnswer: mongoose.Schema.Types.Mixed, // could be string/index
    }
  ],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 1 },
  passed: { type: Boolean, default: false },
});

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
