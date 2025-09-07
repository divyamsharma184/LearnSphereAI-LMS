const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse
} = require('../controllers/coursecontroller');

// Public
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected
router.post('/', createCourse);
router.post('/:id/enroll', enrollInCourse);

module.exports = router;
