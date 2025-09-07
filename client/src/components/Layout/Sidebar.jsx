import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  GraduationCap,
  Shield,
  Bell,
  FileQuestion,
  X,
  Plus,
  Award,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Courses', path: '/courses', icon: BookOpen },
        { name: 'Assignments', path: '/assignments', icon: FileText },
        { name: 'My Grades', path: '/grades', icon: Award },
        { name: 'Quizzes', path: '/quizzes', icon: FileQuestion },
        { name: 'Discussions', path: '/discussions', icon: MessageSquare },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        // AI tools
        { name: 'AI', path: '/ai', icon: TrendingUp },
        { name: 'AI Tutor', path: '/ai/tutor', icon: GraduationCap },
      ];
    }

    if (user?.role === 'instructor') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Courses', path: '/courses', icon: BookOpen },
        { name: 'Create Course', path: '/create-course', icon: Plus },
        { name: 'Assignments', path: '/assignments', icon: FileText },
        { name: 'Quizzes', path: '/quizzes', icon: FileQuestion },
        { name: 'Discussions', path: '/discussions', icon: MessageSquare },
        { name: 'Students', path: '/students', icon: UserCheck },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'AI', path: '/ai', icon: TrendingUp },
        { name: 'AI Quiz Generator', path: '/ai/quiz-generator', icon: FileQuestion },
        { name: 'AI Tutor', path: '/ai/tutor', icon: GraduationCap },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Admin Panel', path: '/admin', icon: Shield },
        { name: 'All Courses', path: '/courses', icon: BookOpen },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Course Management', path: '/admin/courses', icon: GraduationCap },
        { name: 'System Analytics', path: '/admin/analytics', icon: TrendingUp },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Admin Settings', path: '/admin/settings', icon: Shield },
        { name: 'AI', path: '/ai', icon: TrendingUp },
        { name: 'AI Quiz Generator', path: '/ai/quiz-generator', icon: FileQuestion },
        { name: 'AI Tutor', path: '/ai/tutor', icon: GraduationCap },
      ];
    }

    // Default fallback
    return [
      { name: 'Dashboard', path: '/dashboard', icon: Home },
      { name: 'Courses', path: '/courses', icon: BookOpen },
      { name: 'AI', path: '/ai', icon: TrendingUp },
    ];
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className="h-full w-64 bg-white shadow-lg border-r border-secondary-200 flex flex-col">
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-secondary-600 hover:text-secondary-900 rounded-lg hover:bg-secondary-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-4 py-3 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.role === 'student' && <BookOpen className="h-4 w-4 text-primary-600" />}
              {user?.role === 'instructor' && <GraduationCap className="h-4 w-4 text-primary-600" />}
              {user?.role === 'admin' && <Shield className="h-4 w-4 text-primary-600" />}
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-900 capitalize">
                {user?.role || 'User'}
              </p>
              <p className="text-xs text-secondary-500">
                {user?.role === 'student' && 'Learning Dashboard'}
                {user?.role === 'instructor' && 'Teaching Dashboard'}
                {user?.role === 'admin' && 'Admin Panel'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-secondary-200 p-4">
          <Link
            to="/settings"
            onClick={onClose}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive('/settings')
                ? 'bg-primary-100 text-primary-700'
                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
            }`}
          >
            <Settings className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="truncate">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
