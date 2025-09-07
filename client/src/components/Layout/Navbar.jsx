import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
  };

  const toggleSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // ✅ Inject Google Translate
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.querySelector('#google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <nav className="navbar-fixed bg-white shadow-lg border-b border-secondary-200">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo + Translate */}
          <div className="flex items-center space-x-3">
            {/* Mobile sidebar toggle - only show when authenticated */}
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="mobile-menu-button lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}

            {/* Logo and Translate */}
            <div className="flex items-center space-x-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="logo-container flex items-center space-x-2"
              >
                <div className="logo-icon">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="logo-text text-lg font-semibold text-secondary-900">LearnSphere</span>
              </Link>

              {/* Google Translate Dropdown */}
              <div id="google_translate_element" className="ml-1" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {/* Search */}
                <div className="search-container">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="notification-button relative text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="notification-badge">3</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="profile-button"
                  >
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={user?.name}
                      className="profile-avatar"
                    />
                    <span className="profile-name">{user?.name}</span>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="dropdown-menu">
                        <div className="px-4 py-2 border-b border-secondary-200">
                          <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                          <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Public user
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
