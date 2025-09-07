import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Calendar,
  Download,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalStudents: 156,
      activeCourses: 4,
      completionRate: 78,
      averageGrade: 84,
      totalAssignments: 24,
      totalQuizzes: 16,
      engagementRate: 92,
      retentionRate: 88,
    },
    studentProgress: [
      { name: 'Week 1', completed: 45, enrolled: 50 },
      { name: 'Week 2', completed: 48, enrolled: 52 },
      { name: 'Week 3', completed: 42, enrolled: 54 },
      { name: 'Week 4', completed: 51, enrolled: 56 },
      { name: 'Week 5', completed: 49, enrolled: 58 },
      { name: 'Week 6', completed: 53, enrolled: 60 },
    ],
    coursePerformance: [
      { course: 'Introduction to React', students: 45, avgGrade: 87, completion: 82 },
      { course: 'Advanced JavaScript', students: 32, avgGrade: 84, completion: 75 },
      { course: 'UI/UX Design', students: 28, avgGrade: 91, completion: 88 },
      { course: 'Node.js Backend', students: 38, avgGrade: 79, completion: 71 },
    ],
    assignmentStats: [
      { assignment: 'React Todo App', submissions: 45, avgGrade: 85, onTime: 42 },
      { assignment: 'JavaScript Quiz', submissions: 38, avgGrade: 82, onTime: 35 },
      { assignment: 'Design Portfolio', submissions: 28, avgGrade: 91, onTime: 26 },
      { assignment: 'API Project', submissions: 35, avgGrade: 78, onTime: 30 },
    ],
    engagementMetrics: {
      dailyActive: [12, 15, 18, 22, 19, 25, 28],
      weeklyActive: [45, 48, 52, 49, 56, 58, 61],
      discussionPosts: 234,
      forumViews: 1567,
      videoWatchTime: 2340, // minutes
      resourceDownloads: 456,
    }
  };

  const getMetricColor = (value, type) => {
    switch (type) {
      case 'grade':
        if (value >= 90) return 'text-green-600';
        if (value >= 80) return 'text-blue-600';
        if (value >= 70) return 'text-yellow-600';
        return 'text-red-600';
      case 'completion':
        if (value >= 85) return 'text-green-600';
        if (value >= 70) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-secondary-900';
    }
  };

  const exportData = () => {
    // Mock export functionality
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Students', analyticsData.overview.totalStudents],
      ['Active Courses', analyticsData.overview.activeCourses],
      ['Completion Rate', analyticsData.overview.completionRate + '%'],
      ['Average Grade', analyticsData.overview.averageGrade + '%'],
      ['Engagement Rate', analyticsData.overview.engagementRate + '%'],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Track student progress and course performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 3 months</option>
            <option value="1year">Last year</option>
          </select>
          
          <button
            onClick={exportData}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Students</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.overview.totalStudents}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Completion Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.overview.completionRate}%</p>
              <p className="text-xs text-green-600 mt-1">+5% from last month</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Grade</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.overview.averageGrade}%</p>
              <p className="text-xs text-green-600 mt-1">+2% from last month</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.overview.engagementRate}%</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Course Performance</h3>
          <div className="space-y-4">
            {analyticsData.coursePerformance.map((course, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900">{course.course}</h4>
                  <span className="text-sm text-secondary-600">{course.students} students</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-secondary-600">Average Grade</div>
                    <div className={`text-lg font-bold ${getMetricColor(course.avgGrade, 'grade')}`}>
                      {course.avgGrade}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-600">Completion</div>
                    <div className={`text-lg font-bold ${getMetricColor(course.completion, 'completion')}`}>
                      {course.completion}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-secondary-600 mb-1">
                    <span>Progress</span>
                    <span>{course.completion}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assignment Statistics</h3>
          <div className="space-y-4">
            {analyticsData.assignmentStats.map((assignment, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900">{assignment.assignment}</h4>
                  <div className="flex items-center space-x-2">
                    {assignment.onTime === assignment.submissions ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-secondary-600">Submissions</div>
                    <div className="font-bold text-secondary-900">{assignment.submissions}</div>
                  </div>
                  <div>
                    <div className="text-secondary-600">Avg Grade</div>
                    <div className={`font-bold ${getMetricColor(assignment.avgGrade, 'grade')}`}>
                      {assignment.avgGrade}%
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary-600">On Time</div>
                    <div className="font-bold text-secondary-900">
                      {assignment.onTime}/{assignment.submissions}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-secondary-600 mb-1">
                    <span>On-time Rate</span>
                    <span>{Math.round((assignment.onTime / assignment.submissions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(assignment.onTime / assignment.submissions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Student Engagement</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.engagementMetrics.discussionPosts}</div>
            <div className="text-sm text-secondary-600">Discussion Posts</div>
            <div className="text-xs text-green-600 mt-1">+15% this week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.engagementMetrics.forumViews}</div>
            <div className="text-sm text-secondary-600">Forum Views</div>
            <div className="text-xs text-green-600 mt-1">+8% this week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(analyticsData.engagementMetrics.videoWatchTime / 60)}h</div>
            <div className="text-sm text-secondary-600">Video Watch Time</div>
            <div className="text-xs text-green-600 mt-1">+22% this week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analyticsData.engagementMetrics.resourceDownloads}</div>
            <div className="text-sm text-secondary-600">Resource Downloads</div>
            <div className="text-xs text-green-600 mt-1">+12% this week</div>
          </div>
        </div>
      </div>

      {/* Student Progress Tracking */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Student Progress Tracking</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 font-medium">Active Students</div>
                  <div className="text-2xl font-bold text-blue-700">142</div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600 font-medium">Completed Courses</div>
                  <div className="text-2xl font-bold text-green-700">89</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-yellow-600 font-medium">At Risk Students</div>
                  <div className="text-2xl font-bold text-yellow-700">14</div>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-secondary-900 mb-3">Weekly Progress Overview</h4>
            <div className="space-y-2">
              {analyticsData.studentProgress.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-sm font-medium text-secondary-700">{week.name}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-secondary-600">
                      {week.completed}/{week.enrolled} completed
                    </span>
                    <div className="w-32 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(week.completed / week.enrolled) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900">
                      {Math.round((week.completed / week.enrolled) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;