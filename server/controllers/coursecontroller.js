const Course = require('../models/course');

// @desc Create new course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Enroll student
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const studentId = req.body.studentId;

    // Check if already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    // Check for max limit
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    course.enrolledStudents.push(studentId);
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (error) {
    console.error('Enroll Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
