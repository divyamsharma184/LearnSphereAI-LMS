const User = require('../models/user'); // adjust path if needed
const Course = require('../models/course');
const Assignment = require('../models/assignments');
const Submission = require('../models/submissionModel');
const Quiz = require('../models/quizModel');

// Overview
exports.getOverviewStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeCourses = await Course.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    // Placeholder values for completion, average grade, etc.
    res.json({
      totalStudents,
      activeCourses,
      completionRate: 78,
      averageGrade: 84,
      totalAssignments,
      totalQuizzes,
      engagementRate: 92,
      retentionRate: 88
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overview stats' });
  }
};

// Student Progress
exports.getStudentProgress = async (req, res) => {
  try {
    const data = [
      { name: 'Week 1', completed: 45, enrolled: 50 },
      { name: 'Week 2', completed: 48, enrolled: 52 },
      { name: 'Week 3', completed: 42, enrolled: 54 },
      { name: 'Week 4', completed: 51, enrolled: 56 },
      { name: 'Week 5', completed: 49, enrolled: 58 },
      { name: 'Week 6', completed: 53, enrolled: 60 },
    ];
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student progress' });
  }
};

// Course Performance
exports.getCoursePerformance = async (req, res) => {
  try {
    const data = [
      { course: 'Introduction to React', students: 45, avgGrade: 87, completion: 82 },
      { course: 'Advanced JavaScript', students: 32, avgGrade: 84, completion: 75 },
      { course: 'UI/UX Design', students: 28, avgGrade: 91, completion: 88 },
      { course: 'Node.js Backend', students: 38, avgGrade: 79, completion: 71 },
    ];
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course performance' });
  }
};

// Assignment Stats
exports.getAssignmentStats = async (req, res) => {
  try {
    const data = [
      { assignment: 'React Todo App', submissions: 45, avgGrade: 85, onTime: 42 },
      { assignment: 'JavaScript Quiz', submissions: 38, avgGrade: 82, onTime: 35 },
      { assignment: 'Design Portfolio', submissions: 28, avgGrade: 91, onTime: 26 },
      { assignment: 'API Project', submissions: 35, avgGrade: 78, onTime: 30 },
    ];
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignment stats' });
  }
};

// Engagement Metrics
exports.getEngagementMetrics = async (req, res) => {
  try {
    const data = {
      dailyActive: [12, 15, 18, 22, 19, 25, 28],
      weeklyActive: [45, 48, 52, 49, 56, 58, 61],
      discussionPosts: 234,
      forumViews: 1567,
      videoWatchTime: 2340, // minutes
      resourceDownloads: 456,
    };
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch engagement metrics' });
  }
};
