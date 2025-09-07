import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  UserCheck,
  UserX,
  GraduationCap,
  BarChart3,
  Calendar,
  Award,
  MessageSquare,
  FileText,
  Settings,
} from 'lucide-react';
import { mockUsers, mockCourses } from '../../utils/mockData';
import { eventBus, EVENTS } from '../../utils/eventBus';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAdminData();

    // Listen for real-time updates
    const handleCourseCreated = () => {
      loadAdminData(); // Reload data when new course is created
    };

    const handleEnrollmentRequested = () => {
      loadAdminData(); // Reload data when new enrollment is requested
    };

    eventBus.on(EVENTS.COURSE_CREATED, handleCourseCreated);
    eventBus.on(EVENTS.ENROLLMENT_REQUESTED, handleEnrollmentRequested);

    return () => {
      eventBus.off(EVENTS.COURSE_CREATED, handleCourseCreated);
      eventBus.off(EVENTS.ENROLLMENT_REQUESTED, handleEnrollmentRequested);
    };
  }, []);

  const loadAdminData = () => {
    // Load pending courses from localStorage
    const storedPendingCourses = JSON.parse(localStorage.getItem('pendingCourses') || '[]');
    setPendingCourses(storedPendingCourses);

    // Load pending enrollments from localStorage
    const storedPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
    setPendingEnrollments(storedPendingEnrollments);

    // Load all users and courses
    setUsers(mockUsers);
    setCourses([...mockCourses, ...JSON.parse(localStorage.getItem('courses') || '[]')]);
  };

  const handleCourseApproval = (courseId, approved) => {
    const course = pendingCourses.find(c => c.id === courseId);
    if (!course) return;

    if (approved) {
      // Move course to approved courses
      const approvedCourse = {
        ...course,
        status: 'active',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name,
      };

      const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      existingCourses.push(approvedCourse);
      localStorage.setItem('courses', JSON.stringify(existingCourses));

      // Emit event for real-time updates
      eventBus.emit(EVENTS.COURSE_APPROVED, approvedCourse);

      toast.success(`Course "${course.title}" has been approved!`);
    } else {
      // Reject course
      const rejectedCourse = {
        ...course,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: user?.name,
      };

      const rejectedCourses = JSON.parse(localStorage.getItem('rejectedCourses') || '[]');
      rejectedCourses.push(rejectedCourse);
      localStorage.setItem('rejectedCourses', JSON.stringify(rejectedCourses));

      toast.error(`Course "${course.title}" has been rejected.`);
    }

    // Remove from pending courses
    const updatedPendingCourses = pendingCourses.filter(c => c.id !== courseId);
    setPendingCourses(updatedPendingCourses);
    localStorage.setItem('pendingCourses', JSON.stringify(updatedPendingCourses));
  };

  const handleEnrollmentApproval = (enrollmentId, approved) => {
    const enrollment = pendingEnrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return;

    if (approved) {
      // Approve enrollment
      const approvedEnrollments = JSON.parse(localStorage.getItem('approvedEnrollments') || '[]');
      approvedEnrollments.push({
        ...enrollment,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name,
      });
      localStorage.setItem('approvedEnrollments', JSON.stringify(approvedEnrollments));

      // Emit event for real-time updates
      eventBus.emit(EVENTS.ENROLLMENT_APPROVED, enrollment);

      toast.success(`Enrollment for ${enrollment.studentName} has been approved!`);
    } else {
      // Reject enrollment
      const rejectedEnrollments = JSON.parse(localStorage.getItem('rejectedEnrollments') || '[]');
      rejectedEnrollments.push({
        ...enrollment,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: user?.name,
      });
      localStorage.setItem('rejectedEnrollments', JSON.stringify(rejectedEnrollments));

      toast.error(`Enrollment for ${enrollment.studentName} has been rejected.`);
    }

    // Remove from pending enrollments
    const updatedPendingEnrollments = pendingEnrollments.filter(e => e.id !== enrollmentId);
    setPendingEnrollments(updatedPendingEnrollments);
    localStorage.setItem('pendingEnrollments', JSON.stringify(updatedPendingEnrollments));
  };

  const getSystemStats = () => {
    const totalUsers = users.length;
    const totalInstructors = users.filter(u => u.role === 'instructor').length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const pendingCoursesCount = pendingCourses.length;
    const pendingEnrollmentsCount = pendingEnrollments.length;

    return {
      totalUsers,
      totalInstructors,
      totalStudents,
      totalCourses,
      activeCourses,
      pendingCoursesCount,
      pendingEnrollmentsCount,
    };
  };

  const stats = getSystemStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pending-courses', label: 'Pending Courses', icon: BookOpen, badge: stats.pendingCoursesCount },
    { id: 'pending-enrollments', label: 'Pending Enrollments', icon: UserCheck, badge: stats.pendingEnrollmentsCount },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: GraduationCap },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Manage users, courses, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary-600" />
          <span className="text-sm font-medium text-primary-600">Administrator</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers}</p>
              <p className="text-xs text-secondary-500">{stats.totalInstructors} instructors, {stats.totalStudents} students</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Courses</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalCourses}</p>
              <p className="text-xs text-secondary-500">{stats.activeCourses} active courses</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.pendingCoursesCount + stats.pendingEnrollmentsCount}</p>
              <p className="text-xs text-secondary-500">{stats.pendingCoursesCount} courses, {stats.pendingEnrollmentsCount} enrollments</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">System Health</p>
              <p className="text-2xl font-bold text-secondary-900">99.9%</p>
              <p className="text-xs text-secondary-500">All systems operational</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">System Overview</h3>
              
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Recent Course Submissions</h4>
                  {pendingCourses.slice(0, 3).map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <div className="font-medium text-secondary-900">{course.title}</div>
                        <div className="text-sm text-secondary-600">by {course.instructor}</div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  ))}
                  {pendingCourses.length === 0 && (
                    <p className="text-secondary-600 text-sm">No pending course submissions</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Recent Enrollment Requests</h4>
                  {pendingEnrollments.slice(0, 3).map(enrollment => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <div className="font-medium text-secondary-900">{enrollment.studentName}</div>
                        <div className="text-sm text-secondary-600">{enrollment.courseName}</div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  ))}
                  {pendingEnrollments.length === 0 && (
                    <p className="text-secondary-600 text-sm">No pending enrollment requests</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pending Courses Tab */}
          {selectedTab === 'pending-courses' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">Pending Course Approvals</h3>
              
              {pendingCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-secondary-900 mb-2">No Pending Courses</h4>
                  <p className="text-secondary-600">All course submissions have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCourses.map(course => (
                    <div key={course.id} className="border border-secondary-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-secondary-900 mb-2">{course.title}</h4>
                          <p className="text-secondary-600 mb-3">{course.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-secondary-600">Instructor:</span>
                              <div className="font-medium">{course.instructor}</div>
                            </div>
                            <div>
                              <span className="text-secondary-600">Category:</span>
                              <div className="font-medium">{course.category}</div>
                            </div>
                            <div>
                              <span className="text-secondary-600">Level:</span>
                              <div className="font-medium">{course.level}</div>
                            </div>
                            <div>
                              <span className="text-secondary-600">Duration:</span>
                              <div className="font-medium">{course.duration}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleCourseApproval(course.id, true)}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleCourseApproval(course.id, false)}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-secondary-500">
                        Submitted on {new Date(course.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Enrollments Tab */}
          {selectedTab === 'pending-enrollments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">Pending Enrollment Requests</h3>
              
              {pendingEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-secondary-900 mb-2">No Pending Enrollments</h4>
                  <p className="text-secondary-600">All enrollment requests have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingEnrollments.map(enrollment => (
                    <div key={enrollment.id} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <img
                              src={enrollment.studentAvatar}
                              alt={enrollment.studentName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-secondary-900">{enrollment.studentName}</h4>
                              <p className="text-sm text-secondary-600">{enrollment.studentEmail}</p>
                              <p className="text-sm text-secondary-600">Course: {enrollment.courseName}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEnrollmentApproval(enrollment.id, true)}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleEnrollmentApproval(enrollment.id, false)}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-secondary-500 mt-2">
                        Requested on {new Date(enrollment.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">User Management</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-secondary-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-900">Join Date</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-secondary-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-secondary-900">{user.name}</div>
                              <div className="text-sm text-secondary-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {selectedTab === 'courses' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">Course Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="border border-secondary-200 rounded-lg p-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-secondary-900 mb-2">{course.title}</h4>
                    <p className="text-sm text-secondary-600 mb-2">by {course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                      <span className="text-sm text-secondary-600">
                        {course.enrolledStudents || 0} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {selectedTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">System Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Course Approval Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Require admin approval for new courses
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Require admin approval for enrollments
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Auto-approve courses from verified instructors
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-secondary-900">Notification Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Email notifications for pending approvals
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Daily admin reports
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Weekly system health reports
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
