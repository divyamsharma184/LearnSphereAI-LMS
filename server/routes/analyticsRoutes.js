const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  getStudentProgress,
  getCoursePerformance,
  getAssignmentStats,
  getEngagementMetrics
} = require('../controllers/analyticsController');

router.get('/overview', getOverviewStats);
router.get('/student-progress', getStudentProgress);
router.get('/course-performance', getCoursePerformance);
router.get('/assignment-stats', getAssignmentStats);
router.get('/engagement-metrics', getEngagementMetrics);

module.exports = router;
