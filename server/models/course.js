const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  level: String,
  duration: String,
  maxStudents: Number,
  startDate: Date,
  endDate: Date,
  price: Number,
  prerequisites: String,
  objectives: String,
  syllabus: String,
  imageUrl: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // AI-related fields
  aiDocuments: [{
    fileName: String,
    fileType: String,
    wordCount: Number,
    processedAt: Date,
  }],
  aiEnabled: { type: Boolean, default: false },
  aiLastUpdated: Date,
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
