import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  FileText,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { mockCourses } from '../../utils/mockData';

const GradesList = () => {
  const { user } = useSelector((state) => state.auth);
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Load student grades from localStorage
    const storedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    const allGrades = [];

    // Get enrolled courses for the current user
    const userEnrolledCourses = user?.enrolledCourses || [1, 2]; // Default to courses 1 and 2 for demo

    // Process assignments from courses
    mockCourses.forEach(course => {
      if (course.assignments && userEnrolledCourses.includes(course.id)) {
        course.assignments.forEach(assignment => {
          const gradeKey = `${user.id}-${assignment.id}`;
          const studentGrade = storedGrades[gradeKey];
          
          // Add assignment grade (either from localStorage or mock data)
          allGrades.push({
            id: assignment.id,
            title: assignment.title,
            type: 'Assignment',
            courseName: course.title,
            courseId: course.id,
            grade: studentGrade?.grade || assignment.grade || 85, // Default grade for demo
            maxPoints: 100,
            feedback: studentGrade?.feedback || 'Good work! Keep it up.',
            submittedAt: studentGrade?.submittedAt || assignment.dueDate,
            gradedAt: studentGrade?.gradedAt || assignment.dueDate,
            dueDate: assignment.dueDate,
            weight: 0.7, // 70% weight for assignments
          });
        });
      }
    });

    // Add mock quiz grades for enrolled courses
    const mockQuizGrades = [
      {
        id: 'quiz-1',
        title: 'React Fundamentals Quiz',
        type: 'Quiz',
        courseName: 'Introduction to React',
        courseId: 1,
        grade: 85,
        maxPoints: 100,
        feedback: 'Good understanding of React basics. Review state management concepts.',
        submittedAt: '2024-02-10T14:30:00',
        gradedAt: '2024-02-10T14:35:00',
        dueDate: '2024-02-10T23:59:00',
        weight: 0.3, // 30% weight for quizzes
      },
      {
        id: 'quiz-2',
        title: 'JavaScript ES6+ Quiz',
        type: 'Quiz',
        courseName: 'Advanced JavaScript',
        courseId: 2,
        grade: 92,
        maxPoints: 100,
        feedback: 'Excellent work! Strong grasp of modern JavaScript features.',
        submittedAt: '2024-02-08T16:45:00',
        gradedAt: '2024-02-08T16:50:00',
        dueDate: '2024-02-08T23:59:00',
        weight: 0.3,
      },
    ];

    // Filter quiz grades for enrolled courses
    const filteredQuizGrades = mockQuizGrades.filter(quiz => 
      userEnrolledCourses.includes(quiz.courseId)
    );

    const combinedGrades = [...allGrades, ...filteredQuizGrades];
    setGrades(combinedGrades);
    setFilteredGrades(combinedGrades);
  }, [user]);

  useEffect(() => {
    let filtered = grades;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(grade =>
        grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(grade => grade.courseId === parseInt(courseFilter));
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(grade => grade.type === typeFilter);
    }

    // Sort by graded date (most recent first)
    filtered.sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt));

    setFilteredGrades(filtered);
  }, [grades, searchTerm, courseFilter, typeFilter]);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBackground = (grade) => {
    if (grade >= 90) return 'bg-green-50 border-green-200';
    if (grade >= 80) return 'bg-blue-50 border-blue-200';
    if (grade >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getLetterGrade = (grade) => {
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 65) return 'D';
    return 'F';
  };

  const calculateCourseGPA = (courseId) => {
    const courseGrades = grades.filter(grade => grade.courseId === courseId);
    if (courseGrades.length === 0) return 0;

    const weightedSum = courseGrades.reduce((sum, grade) => {
      return sum + (grade.grade * grade.weight);
    }, 0);

    const totalWeight = courseGrades.reduce((sum, grade) => sum + grade.weight, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const calculateOverallGPA = () => {
    if (grades.length === 0) return 0;
    
    const courseIds = [...new Set(grades.map(grade => grade.courseId))];
    const courseGPAs = courseIds.map(courseId => calculateCourseGPA(courseId));
    
    return courseGPAs.reduce((sum, gpa) => sum + gpa, 0) / courseGPAs.length;
  };

  const getGradeStats = () => {
    const totalGrades = grades.length;
    const averageGrade = totalGrades > 0 
      ? grades.reduce((sum, grade) => sum + grade.grade, 0) / totalGrades 
      : 0;
    
    const gradeDistribution = {
      A: grades.filter(g => g.grade >= 90).length,
      B: grades.filter(g => g.grade >= 80 && g.grade < 90).length,
      C: grades.filter(g => g.grade >= 70 && g.grade < 80).length,
      D: grades.filter(g => g.grade >= 60 && g.grade < 70).length,
      F: grades.filter(g => g.grade < 60).length,
    };

    return {
      total: totalGrades,
      average: averageGrade,
      distribution: gradeDistribution,
      gpa: calculateOverallGPA(),
    };
  };

  const exportGrades = () => {
    const csvContent = [
      ['Course', 'Assignment/Quiz', 'Type', 'Grade', 'Letter Grade', 'Date Graded', 'Feedback'],
      ...filteredGrades.map(grade => [
        grade.courseName,
        grade.title,
        grade.type,
        grade.grade + '%',
        getLetterGrade(grade.grade),
        new Date(grade.gradedAt).toLocaleDateString(),
        grade.feedback.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_grades.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get enrolled courses for filter dropdown
  const userEnrolledCourses = user?.enrolledCourses || [1, 2];
  const enrolledCourses = mockCourses.filter(course => 
    userEnrolledCourses.includes(course.id)
  );

  const stats = getGradeStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Grades</h1>
          <p className="text-secondary-600 mt-1">
            Track your academic performance across all courses
          </p>
        </div>
        
        <button
          onClick={exportGrades}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Grades</span>
        </button>
      </div>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Overall GPA</p>
              <p className={`text-2xl font-bold ${getGradeColor(stats.gpa)}`}>
                {stats.gpa.toFixed(2)}
              </p>
              <p className="text-xs text-secondary-500">4.0 scale</p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Grade</p>
              <p className={`text-2xl font-bold ${getGradeColor(stats.average)}`}>
                {stats.average.toFixed(1)}%
              </p>
              <p className="text-xs text-secondary-500">{getLetterGrade(stats.average)} average</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Grades</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
              <p className="text-xs text-secondary-500">Assignments & Quizzes</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">A Grades</p>
              <p className="text-2xl font-bold text-green-600">{stats.distribution.A}</p>
              <p className="text-xs text-secondary-500">
                {stats.total > 0 ? Math.round((stats.distribution.A / stats.total) * 100) : 0}% of total
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(stats.distribution).map(([letter, count]) => (
            <div key={letter} className="text-center">
              <div className={`text-2xl font-bold ${
                letter === 'A' ? 'text-green-600' :
                letter === 'B' ? 'text-blue-600' :
                letter === 'C' ? 'text-yellow-600' :
                letter === 'D' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {count}
              </div>
              <div className="text-sm text-secondary-600">{letter} Grade{count !== 1 ? 's' : ''}</div>
              <div className="text-xs text-secondary-500">
                {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search grades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All Courses</option>
              {enrolledCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="Assignment">Assignments</option>
            <option value="Quiz">Quizzes</option>
            <option value="Exam">Exams</option>
          </select>

          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="space-y-4">
        {filteredGrades.map((grade) => (
          <div key={`${grade.type}-${grade.id}`} className={`bg-white rounded-xl p-6 shadow-sm border ${getGradeBackground(grade.grade)} card-hover`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {grade.type === 'Assignment' ? (
                    <FileText className="h-5 w-5 text-primary-600" />
                  ) : (
                    <Award className="h-5 w-5 text-purple-600" />
                  )}
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {grade.title}
                  </h3>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
                    {grade.type}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-secondary-600 mb-3">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{grade.courseName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Graded: {new Date(grade.gradedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {grade.feedback && (
                  <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium text-secondary-900 mb-1">Instructor Feedback</h4>
                    <p className="text-sm text-secondary-700">{grade.feedback}</p>
                  </div>
                )}
              </div>

              <div className="text-right ml-6">
                <div className={`text-3xl font-bold ${getGradeColor(grade.grade)} mb-1`}>
                  {grade.grade}%
                </div>
                <div className={`text-lg font-semibold ${getGradeColor(grade.grade)} mb-1`}>
                  {getLetterGrade(grade.grade)}
                </div>
                <div className="text-sm text-secondary-600">
                  {grade.grade}/{grade.maxPoints} points
                </div>
                <div className="text-xs text-secondary-500 mt-1">
                  Weight: {Math.round(grade.weight * 100)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No grades found</h3>
          <p className="text-secondary-600">
            {grades.length === 0 
              ? 'Complete assignments and quizzes to see your grades here.'
              : 'No grades match your current filter criteria.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GradesList;