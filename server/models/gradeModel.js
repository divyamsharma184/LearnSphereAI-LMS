const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', default: null },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },
  grade: { type: Number, required: true },
  feedback: { type: String },
  gradedAt: { type: Date, default: Date.now },
  gradedBy: { type: String }, // instructor name or ID
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
