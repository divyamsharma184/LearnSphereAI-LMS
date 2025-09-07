const express = require('express');
const router = express.Router();
const { recordGrade, getGradesByStudent } = require('../controllers/gradeController');

router.post('/', recordGrade);
router.get('/:studentId', getGradesByStudent);

module.exports = router;
