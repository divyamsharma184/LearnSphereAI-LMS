import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  FileText,
  MessageSquare,
  Plus,
  BarChart3,
  GraduationCap,
} from 'lucide-react';
import { mockCourses, mockAnnouncements } from '../../utils/mockData';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Enrolled Courses',
          value: user?.enrolledCourses?.length || '0',
          icon: BookOpen,
          color: 'bg-blue-500',
          change: '+1 this month',
          link: '/courses',
        },
        {
          title: 'Assignments Due',
          value: '5',
          icon: Clock,
          color: 'bg-orange-500',
          change: '2 due this week',
          link: '/assignments',
        },
        {
          title: 'Completed',
          value: '12',
          icon: CheckCircle,
          color: 'bg-green-500',
          change: '+3 this week',
          link: '/assignments',
        },
        {
          title: 'Average Grade',
          value: '88%',
          icon: Award,
          color: 'bg-purple-500',
          change: '+2% improvement',
          link: '/grades',
        },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        {
          title: 'Active Courses',
          value: '4',
          icon: BookOpen,
          color: 'bg-blue-500',
          change: '+1 this semester',
          link: '/courses',
        },
        {
          title: 'Total Students',
          value: '156',
          icon: Users,
          color: 'bg-green-500',
          change: '+12 this month',
          link: '/students',
        },
        {
          title: 'Pending Reviews',
          value: '23',
          icon: AlertCircle,
          color: 'bg-orange-500',
          change: '8 urgent',
          link: '/assignments',
        },
        {
          title: 'Course Rating',
          value: '4.8',
          icon: Award,
          color: 'bg-purple-500',
          change: '+0.2 this month',
          link: '/analytics',
        },
      ];
    }

    // Admin stats
    return [
      {
        title: 'Total Courses',
        value: '45',
        icon: BookOpen,
        color: 'bg-blue-500',
        change: '+5 this month',
        link: '/admin/courses',
      },
      {
        title: 'Active Users',
        value: '1,234',
        icon: Users,
        color: 'bg-green-500',
        change: '+89 this week',
        link: '/admin/users',
      },
      {
        title: 'System Health',
        value: '99.9%',
        icon: TrendingUp,
        color: 'bg-emerald-500',
        change: 'All systems operational',
        link: '/admin/analytics',
      },
      {
        title: 'Revenue',
        value: '$12,450',
        icon: Award,
        color: 'bg-purple-500',
        change: '+15% this month',
        link: '/admin/reports',
      },
    ];
  };

  const getQuickActions = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Browse Courses',
          description: 'Discover new learning opportunities',
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          link: '/courses',
        },
        {
          title: 'View Assignments',
          description: 'Check upcoming deadlines',
          icon: FileText,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          link: '/assignments',
        },
        {
          title: 'Take Quizzes',
          description: 'Test your knowledge',
          icon: Award,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          link: '/quizzes',
        },
        {
          title: 'Join Discussions',
          description: 'Connect with peers',
          icon: MessageSquare,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          link: '/discussions',
        },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        {
          title: 'Create Course',
          description: 'Start a new course',
          icon: Plus,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          link: '/create-course',
        },
        {
          title: 'Create Assignment',
          description: 'Add new assignment',
          icon: FileText,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          link: '/assignments/create',
        },
        {
          title: 'Create Quiz',
          description: 'Design a new quiz',
          icon: Award,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          link: '/quizzes/create',
        },
        {
          title: 'View Analytics',
          description: 'Track student progress',
          icon: BarChart3,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          link: '/analytics',
        },
      ];
    }

    return [
      {
        title: 'Manage Users',
        description: 'User administration',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        link: '/admin/users',
      },
      {
        title: 'System Analytics',
        description: 'Platform insights',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        link: '/admin/analytics',
      },
      {
        title: 'Course Management',
        description: 'Oversee all courses',
        icon: GraduationCap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        link: '/admin/courses',
      },
      {
        title: 'Reports',
        description: 'Generate reports',
        icon: BarChart3,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        link: '/admin/reports',
      },
    ];
  };

  const statsCards = getStatsCards();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          {user?.role === 'student' && "Ready to continue your learning journey?"}
          {user?.role === 'instructor' && "Your students are waiting for your guidance."}
          {user?.role === 'admin' && "Here's your system overview for today."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 card-hover block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{card.title}</p>
                  <p className="text-2xl font-bold text-secondary-900 mt-1">{card.value}</p>
                  <p className="text-xs text-secondary-500 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / My Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">
              {user?.role === 'student' ? 'My Courses' : 'Recent Courses'}
            </h2>
            <Link
              to="/courses"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockCourses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors duration-200 block"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-900">{course.title}</h3>
                  <p className="text-sm text-secondary-600">{course.instructor}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-32 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-secondary-500 ml-2">
                      {course.progress || 0}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">{course.level}</p>
                  <p className="text-xs text-secondary-500">{course.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & Announcements */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{action.title}</p>
                      <p className="text-xs text-secondary-600">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Announcements
            </h2>
            <div className="space-y-3">
              {mockAnnouncements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <h3 className="font-medium text-secondary-900 text-sm">
                    {announcement.title}
                  </h3>
                  <p className="text-xs text-secondary-600 mt-1">
                    {announcement.content.substring(0, 80)}...
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;