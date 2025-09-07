import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FileQuestion,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Trophy,
  BookOpen,
  Calendar,
  Filter,
  Search,
  Plus,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { eventBus, EVENTS } from '../../utils/eventBus';
import toast from 'react-hot-toast';

const QuizList = () => {
  const { user } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Mock quiz data
  const mockQuizzes = [
    {
      id: 1,
      title: 'React Fundamentals Quiz',
      courseId: 1,
      courseName: 'Introduction to React',
      description: 'Test your knowledge of React basics including components, props, and state.',
      questions: 15,
      timeLimit: 30, // minutes
      attempts: user?.role === 'student' ? 1 : 0,
      maxAttempts: 3,
      bestScore: user?.role === 'student' ? 85 : null,
      lastAttempt: user?.role === 'student' ? '2024-02-10' : null,
      dueDate: '2024-02-20',
      status: user?.role === 'student' ? 'completed' : 'active',
      difficulty: 'Beginner',
      points: 100,
      totalSubmissions: user?.role === 'instructor' ? 45 : 0,
      averageScore: user?.role === 'instructor' ? 78 : 0,
      createdAt: '2024-02-01',
      instructorId: 2,
    },
    {
      id: 2,
      title: 'JavaScript ES6+ Features',
      courseId: 2,
      courseName: 'Advanced JavaScript',
      description: 'Assessment on modern JavaScript features including arrow functions, destructuring, and async/await.',
      questions: 20,
      timeLimit: 45,
      attempts: user?.role === 'student' ? 1 : 0,
      maxAttempts: 2,
      bestScore: user?.role === 'student' ? 92 : null,
      lastAttempt: user?.role === 'student' ? '2024-02-08' : null,
      dueDate: '2024-02-25',
      status: user?.role === 'student' ? 'completed' : 'active',
      difficulty: 'Advanced',
      points: 150,
      totalSubmissions: user?.role === 'instructor' ? 32 : 0,
      averageScore: user?.role === 'instructor' ? 84 : 0,
      createdAt: '2024-01-15',
      instructorId: 3,
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      courseId: 3,
      courseName: 'UI/UX Design Principles',
      description: 'Quiz covering fundamental design principles, color theory, and user experience concepts.',
      questions: 12,
      timeLimit: 25,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      lastAttempt: null,
      dueDate: '2024-03-01',
      status: 'available',
      difficulty: 'Intermediate',
      points: 80,
      totalSubmissions: 0,
      averageScore: 0,
      createdAt: '2024-02-05',
      instructorId: 4,
    },
  ];

  useEffect(() => {
    loadQuizzes();

    // Listen for real-time updates
    const handleQuizCreated = () => {
      loadQuizzes(); // Reload quizzes when new quiz is created
    };

    eventBus.on(EVENTS.QUIZ_CREATED, handleQuizCreated);

    return () => {
      eventBus.off(EVENTS.QUIZ_CREATED, handleQuizCreated);
    };
  }, [user]);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, statusFilter, courseFilter]);

  const loadQuizzes = () => {
    // Load quizzes from localStorage and merge with mock data
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    let allQuizzes = [...mockQuizzes, ...storedQuizzes];
    
    // Filter quizzes based on user role
    let userQuizzes = allQuizzes;
    
    if (user?.role === 'student') {
      userQuizzes = allQuizzes.filter(quiz => 
        user.enrolledCourses?.includes(quiz.courseId) || [1, 2].includes(quiz.courseId) // Default enrolled courses for demo
      );
    } else if (user?.role === 'instructor') {
      userQuizzes = allQuizzes.filter(quiz => quiz.instructorId === user.id);
    }

    setQuizzes(userQuizzes);
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quiz => quiz.status === statusFilter);
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(quiz => quiz.courseId === parseInt(courseFilter));
    }

    setFilteredQuizzes(filtered);
  };

  const getStatusInfo = (quiz) => {
    const now = new Date();
    const dueDate = new Date(quiz.dueDate);
    
    if (user?.role === 'instructor') {
      return {
        label: quiz.status === 'active' ? 'Active' : 'Draft',
        color: quiz.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
        icon: quiz.status === 'active' ? CheckCircle : Clock,
      };
    }
    
    if (quiz.status === 'completed') {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      };
    }
    
    if (quiz.attempts >= quiz.maxAttempts) {
      return {
        label: 'No Attempts Left',
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
      };
    }
    
    if (dueDate < now) {
      return {
        label: 'Overdue',
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
      };
    }
    
    return {
      label: 'Available',
      color: 'bg-blue-100 text-blue-800',
      icon: Play,
    };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const updatedQuizzes = storedQuizzes.filter(quiz => quiz.id !== quizId);
      localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
      
      // Update state immediately
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      
      // Emit event for real-time updates
      eventBus.emit(EVENTS.QUIZ_DELETED, { quizId });
      
      toast.success('Quiz deleted successfully');
    }
  };

  const handleTakeQuiz = (quizId) => {
    // Navigate to quiz taking interface
    window.location.href = `/quizzes/${quizId}/take`;
  };

  const enrolledCourses = [
    { id: 1, title: 'Introduction to React' },
    { id: 2, title: 'Advanced JavaScript' },
    { id: 3, title: 'UI/UX Design Principles' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {user?.role === 'instructor' ? 'Quiz Management' : 'My Quizzes'}
          </h1>
          <p className="text-secondary-600 mt-1">
            {user?.role === 'instructor' 
              ? 'Create and manage quizzes for your courses'
              : 'Test your knowledge with course quizzes'
            }
          </p>
        </div>
        
        {user?.role === 'instructor' && (
          <Link
            to="/quizzes/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Quiz</span>
          </Link>
        )}
      </div>

      {/* Statistics for Instructors */}
      {user?.role === 'instructor' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-secondary-900">{quizzes.length}</p>
              </div>
              <FileQuestion className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Submissions</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {quizzes.reduce((sum, quiz) => sum + (quiz.totalSubmissions || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Score</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {quizzes.length > 0 
                    ? Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.averageScore || 0), 0) / quizzes.length)
                    : 0
                  }%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Quizzes</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {quizzes.filter(quiz => quiz.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All Status</option>
              {user?.role === 'instructor' ? (
                <>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </>
              ) : (
                <>
                  <option value="available">Available</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </>
              )}
            </select>
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Courses</option>
            {enrolledCourses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}</span>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const statusInfo = getStatusInfo(quiz);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileQuestion className="h-5 w-5 text-primary-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {quiz.title}
                </h3>

                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-secondary-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{quiz.courseName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-secondary-600">
                    <div className="flex items-center">
                      <FileQuestion className="h-4 w-4 mr-1" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-secondary-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{quiz.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* Student View - Attempt Info */}
                {user?.role === 'student' && (
                  <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">
                        Attempts: {quiz.attempts}/{quiz.maxAttempts}
                      </span>
                      {quiz.bestScore && (
                        <span className="font-medium text-primary-600">
                          Best Score: {quiz.bestScore}%
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructor View - Statistics */}
                {user?.role === 'instructor' && (
                  <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-secondary-600" />
                        <span className="text-secondary-600">{quiz.totalSubmissions} submissions</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1 text-secondary-600" />
                        <span className="text-secondary-600">Avg: {quiz.averageScore}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {user?.role === 'student' ? (
                    <button
                      onClick={() => handleTakeQuiz(quiz.id)}
                      disabled={quiz.status === 'completed' || quiz.attempts >= quiz.maxAttempts}
                      className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        quiz.status === 'completed' || quiz.attempts >= quiz.maxAttempts
                          ? 'bg-secondary-100 text-secondary-600 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {quiz.status === 'completed' ? 'View Results' :
                       quiz.attempts >= quiz.maxAttempts ? 'No Attempts Left' :
                       quiz.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  ) : (
                    <>
                      <Link
                        to={`/quizzes/${quiz.id}/results`}
                        className="flex-1 text-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Results
                      </Link>
                      <Link
                        to={`/quizzes/${quiz.id}/edit`}
                        className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No quizzes found</h3>
          <p className="text-secondary-600 mb-4">
            {user?.role === 'instructor' 
              ? 'Create your first quiz to assess student knowledge.'
              : 'No quizzes available at the moment.'
            }
          </p>
          {user?.role === 'instructor' && (
            <Link
              to="/quizzes/create"
              className="btn-primary"
            >
              Create Your First Quiz
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizList;
