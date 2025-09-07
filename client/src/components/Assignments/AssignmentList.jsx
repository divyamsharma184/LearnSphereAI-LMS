import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Plus,
  BookOpen,
  User,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Upload,
  Award,
  TrendingUp,
} from 'lucide-react';
import { mockCourses } from '../../utils/mockData';
import toast from 'react-hot-toast';

const AssignmentList = () => {
  const { user } = useSelector((state) => state.auth);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [studentGrades, setStudentGrades] = useState({});

  useEffect(() => {
    // Load student grades from localStorage
    const storedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    setStudentGrades(storedGrades);

    // Load assignments from localStorage and merge with mock data
    const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    
    // Collect all assignments from enrolled courses
    let allAssignments = [];
    
    mockCourses.forEach(course => {
      if (course.assignments) {
        course.assignments.forEach(assignment => {
          // Get student's grade for this assignment
          const gradeKey = `${user?.id}-${assignment.id}`;
          const studentGrade = storedGrades[gradeKey];
          
          allAssignments.push({
            ...assignment,
            courseName: course.title,
            courseId: course.id,
            instructor: course.instructor,
            instructorId: course.instructorId,
            // Student-specific data
            grade: studentGrade?.grade || assignment.grade || null,
            feedback: studentGrade?.feedback || '',
            submittedAt: studentGrade?.submittedAt || null,
            submitted: studentGrade?.submitted || assignment.submitted || false,
            // Instructor-specific data
            totalSubmissions: user?.role === 'instructor' ? 45 : 0,
            gradedSubmissions: user?.role === 'instructor' ? 32 : 0,
            averageGrade: user?.role === 'instructor' ? 78 : 0,
            createdAt: '2024-02-01',
          });
        });
      }
    });

    // Add stored assignments
    allAssignments = [...allAssignments, ...storedAssignments.map(assignment => {
      const gradeKey = `${user?.id}-${assignment.id}`;
      const studentGrade = storedGrades[gradeKey];
      
      return {
        ...assignment,
        grade: studentGrade?.grade || null,
        feedback: studentGrade?.feedback || '',
        submittedAt: studentGrade?.submittedAt || null,
        submitted: studentGrade?.submitted || false,
      };
    })];

    // Filter based on user role
    if (user?.role === 'student') {
      allAssignments = allAssignments.filter(assignment => 
        user.enrolledCourses?.includes(assignment.courseId)
      );
    } else if (user?.role === 'instructor') {
      allAssignments = allAssignments.filter(assignment => 
        assignment.instructorId === user.id
      );
    }

    setAssignments(allAssignments);
    setFilteredAssignments(allAssignments);
  }, [user]);

  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        
        switch (statusFilter) {
          case 'submitted':
            return assignment.submitted;
          case 'pending':
            return !assignment.submitted && dueDate > now;
          case 'overdue':
            return !assignment.submitted && dueDate < now;
          case 'graded':
            return assignment.grade !== null;
          default:
            return true;
        }
      });
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.courseId === parseInt(courseFilter));
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, courseFilter]);

  const getStatusInfo = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (user?.role === 'instructor') {
      return {
        status: 'active',
        label: 'Active',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      };
    }
    
    if (assignment.submitted) {
      if (assignment.grade !== null) {
        return {
          status: 'graded',
          label: `Graded: ${assignment.grade}%`,
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
        };
      }
      return {
        status: 'submitted',
        label: 'Submitted',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      };
    }
    
    if (dueDate < now) {
      return {
        status: 'overdue',
        label: 'Overdue',
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
      };
    }
    
    return {
      status: 'pending',
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    };
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      const updatedAssignments = storedAssignments.filter(assignment => assignment.id !== assignmentId);
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      toast.success('Assignment deleted successfully');
    }
  };

  const handleSubmitAssignment = (assignmentId) => {
    // Mock submission functionality
    const gradeKey = `${user?.id}-${assignmentId}`;
    const updatedGrades = {
      ...studentGrades,
      [gradeKey]: {
        submitted: true,
        submittedAt: new Date().toISOString(),
        grade: null,
        feedback: '',
      }
    };
    
    setStudentGrades(updatedGrades);
    localStorage.setItem('studentGrades', JSON.stringify(updatedGrades));
    
    // Update assignment status
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, submitted: true, submittedAt: new Date().toISOString() }
        : assignment
    ));
    
    toast.success('Assignment submitted successfully!');
  };

  const handleViewGrades = () => {
    // Navigate to grades page or show grades modal
    toast.info('Opening grades overview...');
  };

  const getStudentStats = () => {
    const submittedCount = assignments.filter(a => a.submitted).length;
    const gradedCount = assignments.filter(a => a.grade !== null).length;
    const averageGrade = gradedCount > 0 
      ? Math.round(assignments.filter(a => a.grade !== null).reduce((sum, a) => sum + a.grade, 0) / gradedCount)
      : 0;
    
    return {
      submitted: submittedCount,
      graded: gradedCount,
      average: averageGrade,
      total: assignments.length,
    };
  };

  const enrolledCourses = mockCourses.filter(course => 
    user?.enrolledCourses?.includes(course.id) || 
    (user?.role === 'instructor' && course.instructorId === user.id)
  );

  const studentStats = user?.role === 'student' ? getStudentStats() : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {user?.role === 'instructor' ? 'Assignment Management' : 'My Assignments'}
          </h1>
          <p className="text-secondary-600 mt-1">
            {user?.role === 'instructor' 
              ? 'Create and manage assignments for your courses'
              : 'Track your assignment progress and submissions'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {user?.role === 'student' && (
            <button
              onClick={handleViewGrades}
              className="btn-secondary flex items-center space-x-2"
            >
              <Award className="h-4 w-4" />
              <span>View Grades</span>
            </button>
          )}
          
          {user?.role === 'instructor' && (
            <Link
              to="/assignments/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Assignment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Student Statistics */}
      {user?.role === 'student' && studentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Assignments</p>
                <p className="text-2xl font-bold text-secondary-900">{studentStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Submitted</p>
                <p className="text-2xl font-bold text-secondary-900">{studentStats.submitted}</p>
                <p className="text-xs text-secondary-500">
                  {studentStats.total > 0 ? Math.round((studentStats.submitted / studentStats.total) * 100) : 0}% completion
                </p>
              </div>
              <Upload className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Graded</p>
                <p className="text-2xl font-bold text-secondary-900">{studentStats.graded}</p>
                <p className="text-xs text-secondary-500">
                  {studentStats.submitted > 0 ? Math.round((studentStats.graded / studentStats.submitted) * 100) : 0}% graded
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(studentStats.average)}`}>
                  {studentStats.average}%
                </p>
                <p className="text-xs text-secondary-500">
                  {studentStats.graded} assignment{studentStats.graded !== 1 ? 's' : ''} graded
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {/* Instructor Statistics */}
      {user?.role === 'instructor' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Assignments</p>
                <p className="text-2xl font-bold text-secondary-900">{assignments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Submissions</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {assignments.reduce((sum, assignment) => sum + (assignment.totalSubmissions || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {assignments.reduce((sum, assignment) => 
                    sum + ((assignment.totalSubmissions || 0) - (assignment.gradedSubmissions || 0)), 0
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Grade</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {assignments.length > 0 
                    ? Math.round(assignments.reduce((sum, assignment) => sum + (assignment.averageGrade || 0), 0) / assignments.length)
                    : 0
                  }%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
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
              placeholder="Search assignments..."
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
              {user?.role === 'student' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                  <option value="overdue">Overdue</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
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
            <span>{filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const statusInfo = getStatusInfo(assignment);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={`${assignment.courseId}-${assignment.id}`} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {assignment.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-secondary-600 mb-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{assignment.courseName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{assignment.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className={`font-medium ${
                        statusInfo.status === 'overdue' ? 'text-red-600' : 
                        statusInfo.status === 'pending' ? 'text-yellow-600' : 
                        'text-secondary-600'
                      }`}>
                        {getDaysUntilDue(assignment.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Student View */}
                      {user?.role === 'student' && (
                        <>
                          {assignment.grade !== null && (
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getGradeColor(assignment.grade)}`}>
                                {assignment.grade}%
                              </div>
                              <div className="text-xs text-secondary-500">Grade</div>
                              {assignment.feedback && (
                                <div className="text-xs text-secondary-600 mt-1 max-w-32 truncate" title={assignment.feedback}>
                                  Feedback available
                                </div>
                              )}
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleSubmitAssignment(assignment.id)}
                            disabled={assignment.submitted}
                            className={`btn-primary flex items-center space-x-1 ${
                              assignment.submitted ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Upload className="h-4 w-4" />
                            <span>{assignment.submitted ? 'Submitted' : 'Submit'}</span>
                          </button>
                        </>
                      )}

                      {/* Instructor View */}
                      {user?.role === 'instructor' && (
                        <>
                          <div className="text-right text-sm text-secondary-600">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{assignment.totalSubmissions} submissions</span>
                              </div>
                              <div className="flex items-center">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                <span>Avg: {assignment.averageGrade}%</span>
                              </div>
                            </div>
                            <div className="mt-1">
                              <span>{assignment.gradedSubmissions}/{assignment.totalSubmissions} graded</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/assignments/${assignment.id}/submissions`}
                              className="btn-primary flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Review</span>
                            </Link>
                            <Link
                              to={`/assignments/${assignment.id}/edit`}
                              className="btn-secondary flex items-center space-x-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No assignments found</h3>
          <p className="text-secondary-600 mb-4">
            {user?.role === 'instructor' 
              ? 'Create your first assignment to get started.'
              : 'No assignments available at the moment.'
            }
          </p>
          {user?.role === 'instructor' && (
            <Link
              to="/assignments/create"
              className="btn-primary"
            >
              Create Your First Assignment
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;