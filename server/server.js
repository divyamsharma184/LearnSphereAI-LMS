const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const courseRoutes = require('./routes/courseroutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CORS_ORIGIN || '*';
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// DB Connection
if (!MONGO_URI) {
  console.error('❌ Missing MongoDB connection string. Set MONGO_URI or MONGODB_URI in your environment.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log('❌ DB connection error:', err.message);
    process.exit(1);
  });
