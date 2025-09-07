const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  dueDate: Date,
  maxPoints: Number,
  submissionType: { type: String, enum: ['file', 'text', 'both'] },
  allowedFileTypes: [String],
  instructions: String,
  rubric: String,
  allowLateSubmissions: Boolean,
  latePenalty: Number,
  groupAssignment: Boolean,
  maxGroupSize: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
