import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  BookOpen,
  User,
  Clock,
  MessageCircle,
  Pin,
  TrendingUp,
} from 'lucide-react';
import { mockDiscussions, mockCourses } from '../../utils/mockData';

const DiscussionList = () => {
  const { user } = useSelector((state) => state.auth);
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Filter discussions based on user's enrolled courses
    let userDiscussions = mockDiscussions;
    
    if (user?.role === 'student') {
      userDiscussions = mockDiscussions.filter(discussion => 
        user.enrolledCourses?.includes(discussion.courseId)
      );
    } else if (user?.role === 'instructor') {
      userDiscussions = mockDiscussions.filter(discussion => {
        const course = mockCourses.find(c => c.id === discussion.courseId);
        return course?.instructorId === user.id;
      });
    }

    // Add course information to discussions
    userDiscussions = userDiscussions.map(discussion => {
      const course = mockCourses.find(c => c.id === discussion.courseId);
      return {
        ...discussion,
        courseName: course?.title || 'Unknown Course',
      };
    });

    setDiscussions(userDiscussions);
    setFilteredDiscussions(userDiscussions);
  }, [user]);

  useEffect(() => {
    let filtered = discussions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(discussion => discussion.courseId === parseInt(courseFilter));
    }

    // Sort discussions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date) - new Date(a.date);
        case 'popular':
          return (b.replies?.length || 0) - (a.replies?.length || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredDiscussions(filtered);
  }, [discussions, searchTerm, courseFilter, sortBy]);

  const getTimeAgo = (date) => {
    const now = new Date();
    const discussionDate = new Date(date);
    const diffTime = Math.abs(now - discussionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const enrolledCourses = mockCourses.filter(course => 
    user?.enrolledCourses?.includes(course.id) || 
    (user?.role === 'instructor' && course.instructorId === user.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Course Discussions</h1>
          <p className="text-secondary-600 mt-1">
            Engage with your peers and instructors in course discussions
          </p>
        </div>
        
        <Link
          to="/discussions/create"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Start Discussion</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Course Filter */}
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

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title A-Z</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div key={discussion.id} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 card-hover">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-primary-100 p-3 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Link
                      to={`/discussions/${discussion.id}`}
                      className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors duration-200"
                    >
                      {discussion.title}
                    </Link>
                    {discussion.pinned && (
                      <Pin className="h-4 w-4 text-yellow-500 inline ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-secondary-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{discussion.replies?.length || 0} replies</span>
                  </div>
                </div>

                <p className="text-secondary-700 mb-3 line-clamp-2">
                  {discussion.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{discussion.courseName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{discussion.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getTimeAgo(discussion.date)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/discussions/${discussion.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Discussion →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No discussions found</h3>
          <p className="text-secondary-600 mb-4">
            Be the first to start a discussion in your courses!
          </p>
          <Link
            to="/discussions/create"
            className="btn-primary"
          >
            Start First Discussion
          </Link>
        </div>
      )}
    </div>
  );
};

export default DiscussionList;