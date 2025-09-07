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

// Middleware
app.use(cors());
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
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sappynath24_db_user:JLl1vvgcuw3CWhnn@learnsphereadv.gylwfnk.mongodb.net/learningsphere?retryWrites=true&w=majority&appName=LearnSphereADV')
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch((err) => {
  console.log('❌ DB connection error:', err.message);
});
