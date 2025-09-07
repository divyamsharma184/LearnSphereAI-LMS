import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Eye,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { mockUsers, mockCourses } from '../../utils/mockData';

const StudentList = () => {
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock student data with progress - ONLY for instructor's courses
  const mockStudentData = [
    {
      id: 5,
      name: 'John Smith',
      email: 'john.smith@student.learnsphere.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrolledCourses: [1], // Only enrolled in course 1 (React course)
      joinDate: '2023-09-01',
      status: 'active',
      year: 'Sophomore',
      major: 'Computer Science',
      overallGrade: 88,
      coursesCompleted: 3,
      assignmentsSubmitted: 12,
      quizzesTaken: 8,
      discussionPosts: 15,
      lastActive: '2024-02-15T10:30:00',
      courseProgress: {
        1: { progress: 75, grade: 85, assignments: 3, quizzes: 2 },
      }
    },
    {
      id: 6,
      name: 'Jane Doe',
      email: 'jane.doe@student.learnsphere.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrolledCourses: [1], // Only enrolled in course 1 (React course)
      joinDate: '2023-09-01',
      status: 'active',
      year: 'Junior',
      major: 'Web Development',
      overallGrade: 94,
      coursesCompleted: 5,
      assignmentsSubmitted: 18,
      quizzesTaken: 12,
      discussionPosts: 22,
      lastActive: '2024-02-16T14:20:00',
      courseProgress: {
        1: { progress: 90, grade: 95, assignments: 3, quizzes: 2 },
      }
    },
    {
      id: 7,
      name: 'Mike Johnson',
      email: 'mike.johnson@student.learnsphere.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      enrolledCourses: [2], // Only enrolled in course 2 (JavaScript course)
      joinDate: '2023-10-15',
      status: 'active',
      year: 'Freshman',
      major: 'Computer Science',
      overallGrade: 76,
      coursesCompleted: 1,
      assignmentsSubmitted: 6,
      quizzesTaken: 4,
      discussionPosts: 8,
      lastActive: '2024-02-14T09:45:00',
      courseProgress: {
        2: { progress: 40, grade: 76, assignments: 1, quizzes: 1 },
      }
    },
  ];

  useEffect(() => {
    loadStudentsForInstructor();
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, courseFilter, performanceFilter]);

  const loadStudentsForInstructor = () => {
    if (user?.role !== 'instructor') {
      setStudents([]);
      return;
    }

    // Get courses taught by this instructor
    const instructorCourses = mockCourses.filter(course => course.instructorId === user.id);
    const courseIds = instructorCourses.map(course => course.id);
    
    // Filter students enrolled ONLY in instructor's courses
    const instructorStudents = mockStudentData.filter(student =>
      student.enrolledCourses.some(courseId => courseIds.includes(courseId))
    );

    setStudents(instructorStudents);
  };

  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.major.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter - only show students enrolled in selected course
    if (courseFilter !== 'all') {
      filtered = filtered.filter(student =>
        student.enrolledCourses.includes(parseInt(courseFilter))
      );
    }

    // Performance filter
    if (performanceFilter !== 'all') {
      filtered = filtered.filter(student => {
        switch (performanceFilter) {
          case 'excellent':
            return student.overallGrade >= 90;
          case 'good':
            return student.overallGrade >= 80 && student.overallGrade < 90;
          case 'average':
            return student.overallGrade >= 70 && student.overallGrade < 80;
          case 'needs-improvement':
            return student.overallGrade < 70;
          default:
            return true;
        }
      });
    }

    setFilteredStudents(filtered);
  };

  const getPerformanceColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (grade) => {
    if (grade >= 90) return 'Excellent';
    if (grade >= 80) return 'Good';
    if (grade >= 70) return 'Average';
    return 'Needs Improvement';
  };

  const getActivityStatus = (lastActive) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffHours = Math.abs(now - lastActiveDate) / (1000 * 60 * 60);
    
    if (diffHours < 24) return { label: 'Active Today', color: 'bg-green-100 text-green-800' };
    if (diffHours < 72) return { label: 'Active Recently', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Inactive', color: 'bg-red-100 text-red-800' };
  };

  // Get only courses taught by this instructor
  const instructorCourses = mockCourses.filter(course => course.instructorId === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Students</h1>
          <p className="text-secondary-600 mt-1">
            Monitor student progress and engagement in your courses
          </p>
        </div>
      </div>

      {/* Statistics Cards - Only for instructor's students */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">My Students</p>
              <p className="text-2xl font-bold text-secondary-900">{students.length}</p>
              <p className="text-xs text-secondary-500">In your courses</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Grade</p>
              <p className="text-2xl font-bold text-secondary-900">
                {students.length > 0 
                  ? Math.round(students.reduce((sum, student) => sum + student.overallGrade, 0) / students.length)
                  : 0
                }%
              </p>
              <p className="text-xs text-secondary-500">Across your courses</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Active Students</p>
              <p className="text-2xl font-bold text-secondary-900">
                {students.filter(student => {
                  const diffHours = Math.abs(new Date() - new Date(student.lastActive)) / (1000 * 60 * 60);
                  return diffHours < 72;
                }).length}
              </p>
              <p className="text-xs text-secondary-500">Last 3 days</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Assignments Submitted</p>
              <p className="text-2xl font-bold text-secondary-900">
                {students.reduce((sum, student) => sum + student.assignmentsSubmitted, 0)}
              </p>
              <p className="text-xs text-secondary-500">Total submissions</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Course Filter - Only instructor's courses */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All My Courses</option>
              {instructorCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Performance Filter - FIXED: Removed < symbol */}
          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Performance</option>
            <option value="excellent">Excellent (90%+)</option>
            <option value="good">Good (80-89%)</option>
            <option value="average">Average (70-79%)</option>
            <option value="needs-improvement">Needs Improvement (Below 70%)</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const activityStatus = getActivityStatus(student.lastActive);
          
          return (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900 truncate">
                        {student.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activityStatus.color}`}>
                        {activityStatus.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-secondary-600 mb-1">{student.email}</p>
                    <p className="text-sm text-secondary-500">{student.major} • {student.year}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Performance Overview */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Overall Grade</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getPerformanceColor(student.overallGrade)}`}>
                        {student.overallGrade}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.overallGrade >= 90 ? 'bg-green-100 text-green-800' :
                        student.overallGrade >= 80 ? 'bg-blue-100 text-blue-800' :
                        student.overallGrade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getPerformanceLabel(student.overallGrade)}
                      </span>
                    </div>
                  </div>

                  {/* Course Progress - Only show courses taught by this instructor */}
                  <div>
                    <div className="text-sm text-secondary-600 mb-2">Course Progress</div>
                    <div className="space-y-2">
                      {student.enrolledCourses
                        .filter(courseId => instructorCourses.some(c => c.id === courseId))
                        .map(courseId => {
                          const course = instructorCourses.find(c => c.id === courseId);
                          const progress = student.courseProgress[courseId];
                          
                          if (!course || !progress) return null;
                          
                          return (
                            <div key={courseId} className="flex items-center justify-between text-sm">
                              <span className="text-secondary-700 truncate flex-1 mr-2">
                                {course.title}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-secondary-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{ width: `${progress.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-secondary-500 w-8">
                                  {progress.progress}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-secondary-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{student.assignmentsSubmitted}</div>
                      <div className="text-xs text-secondary-600">Assignments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{student.quizzesTaken}</div>
                      <div className="text-xs text-secondary-600">Quizzes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{student.discussionPosts}</div>
                      <div className="text-xs text-secondary-600">Posts</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View Details
                    </button>
                    <button className="btn-secondary text-sm py-2 px-3">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="btn-secondary text-sm py-2 px-3">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No students found</h3>
          <p className="text-secondary-600">
            {students.length === 0 
              ? 'No students are enrolled in your courses yet.'
              : 'No students match your current filter criteria.'
            }
          </p>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Student Details: {selectedStudent.name}
                </h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-secondary-900">{selectedStudent.name}</h4>
                      <p className="text-secondary-600">{selectedStudent.email}</p>
                      <p className="text-sm text-secondary-500">{selectedStudent.major} • {selectedStudent.year}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-secondary-600">Join Date</div>
                      <div className="font-medium text-secondary-900">
                        {new Date(selectedStudent.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-secondary-600">Last Active</div>
                      <div className="font-medium text-secondary-900">
                        {new Date(selectedStudent.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-secondary-900">Performance Summary</h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary-600">{selectedStudent.overallGrade}%</div>
                      <div className="text-sm text-secondary-600">Overall Grade</div>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{selectedStudent.coursesCompleted}</div>
                      <div className="text-sm text-secondary-600">Courses Completed</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{selectedStudent.assignmentsSubmitted}</div>
                      <div className="text-xs text-secondary-600">Assignments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{selectedStudent.quizzesTaken}</div>
                      <div className="text-xs text-secondary-600">Quizzes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-900">{selectedStudent.discussionPosts}</div>
                      <div className="text-xs text-secondary-600">Posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Progress Details - Only instructor's courses */}
              <div className="mt-6">
                <h5 className="font-semibold text-secondary-900 mb-4">Course Progress in Your Courses</h5>
                <div className="space-y-4">
                  {selectedStudent.enrolledCourses
                    .filter(courseId => instructorCourses.some(c => c.id === courseId))
                    .map(courseId => {
                      const course = instructorCourses.find(c => c.id === courseId);
                      const progress = selectedStudent.courseProgress[courseId];
                      
                      if (!course || !progress) return null;
                      
                      return (
                        <div key={courseId} className="border border-secondary-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium text-secondary-900">{course.title}</h6>
                            <span className={`text-lg font-bold ${getPerformanceColor(progress.grade)}`}>
                              {progress.grade}%
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex-1 bg-secondary-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-secondary-600">{progress.progress}% complete</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-secondary-600">Assignments: </span>
                              <span className="font-medium">{progress.assignments} completed</span>
                            </div>
                            <div>
                              <span className="text-secondary-600">Quizzes: </span>
                              <span className="font-medium">{progress.quizzes} taken</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
