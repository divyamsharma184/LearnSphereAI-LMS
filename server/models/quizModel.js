const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'], required: true },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  points: { type: Number, default: 1 },
  explanation: String,
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  timeLimit: Number,
  maxAttempts: Number,
  dueDate: Date,
  instructions: String,
  shuffleQuestions: Boolean,
  showResults: Boolean,
  passingScore: Number,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // AI-related fields
  isAIGenerated: { type: Boolean, default: false },
  aiGenerationData: {
    difficulty: String,
    questionType: String,
    sourceDocuments: [String],
    generatedAt: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
