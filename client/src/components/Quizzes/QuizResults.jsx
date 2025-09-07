import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Users,
  BarChart3,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Filter,
  Search,
} from 'lucide-react';

const QuizResults = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [quiz, setQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Mock quiz data
  const mockQuiz = {
    id: 1,
    title: 'React Fundamentals Quiz',
    courseName: 'Introduction to React',
    totalQuestions: 15,
    totalPoints: 100,
    timeLimit: 30,
    dueDate: '2024-02-20T23:59:00',
    createdAt: '2024-02-01T10:00:00',
  };

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 1,
      studentId: 5,
      studentName: 'John Smith',
      studentEmail: 'john.smith@student.learnsphere.com',
      submittedAt: '2024-02-15T14:30:00',
      timeSpent: 25, // minutes
      score: 85,
      totalPoints: 100,
      percentage: 85,
      status: 'completed',
      answers: [
        { questionId: 1, answer: 0, correct: true, points: 5 },
        { questionId: 2, answer: 1, correct: false, points: 0 },
        // ... more answers
      ],
    },
    {
      id: 2,
      studentId: 6,
      studentName: 'Jane Doe',
      studentEmail: 'jane.doe@student.learnsphere.com',
      submittedAt: '2024-02-16T09:15:00',
      timeSpent: 28,
      score: 92,
      totalPoints: 100,
      percentage: 92,
      status: 'completed',
      answers: [],
    },
    {
      id: 3,
      studentId: 7,
      studentName: 'Mike Johnson',
      studentEmail: 'mike.johnson@student.learnsphere.com',
      submittedAt: null,
      timeSpent: 0,
      score: 0,
      totalPoints: 100,
      percentage: 0,
      status: 'not-submitted',
      answers: [],
    },
  ];

  useEffect(() => {
    setQuiz(mockQuiz);
    setSubmissions(mockSubmissions);
    setFilteredSubmissions(mockSubmissions);
  }, [id]);

  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter]);

  const getStatistics = () => {
    const completed = submissions.filter(s => s.status === 'completed');
    const totalStudents = submissions.length;
    const completedCount = completed.length;
    const averageScore = completed.length > 0 
      ? completed.reduce((sum, s) => sum + s.percentage, 0) / completed.length 
      : 0;
    const highestScore = completed.length > 0 
      ? Math.max(...completed.map(s => s.percentage)) 
      : 0;
    const lowestScore = completed.length > 0 
      ? Math.min(...completed.map(s => s.percentage)) 
      : 0;

    return {
      totalStudents,
      completedCount,
      completionRate: (completedCount / totalStudents) * 100,
      averageScore,
      highestScore,
      lowestScore,
    };
  };

  const stats = getStatistics();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'not-submitted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportResults = () => {
    // Mock export functionality
    const csvContent = [
      ['Student Name', 'Email', 'Score', 'Percentage', 'Time Spent', 'Status', 'Submitted At'],
      ...filteredSubmissions.map(s => [
        s.studentName,
        s.studentEmail,
        s.score,
        s.percentage + '%',
        s.timeSpent + ' min',
        s.status,
        s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'Not submitted'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/quizzes"
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{quiz.title}</h1>
            <p className="text-secondary-600">{quiz.courseName}</p>
          </div>
        </div>
        
        <button
          onClick={exportResults}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Students</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Completion Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.completionRate.toFixed(1)}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Score</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.averageScore.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Highest Score</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.highestScore}%</p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-submitted">Not Submitted</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredSubmissions.length} student{filteredSubmissions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Student</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Score</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Time Spent</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Submitted</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-secondary-900">{submission.studentName}</div>
                      <div className="text-sm text-secondary-600">{submission.studentEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getGradeColor(submission.percentage)}`}>
                        {submission.percentage}%
                      </span>
                      <span className="text-sm text-secondary-600">
                        ({submission.score}/{submission.totalPoints})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-secondary-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{submission.timeSpent} min</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status === 'completed' ? 'Completed' :
                       submission.status === 'in-progress' ? 'In Progress' : 'Not Submitted'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-secondary-600">
                    {submission.submittedAt 
                      ? new Date(submission.submittedAt).toLocaleString()
                      : '-'
                    }
                  </td>
                  <td className="py-4 px-6">
                    {submission.status === 'completed' && (
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No submissions found</h3>
          <p className="text-secondary-600">
            No students match your current filter criteria.
          </p>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {selectedSubmission.studentName}'s Submission
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-secondary-600">Score</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedSubmission.percentage}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary-600">Time Spent</div>
                  <div className="text-lg font-medium text-secondary-900">
                    {selectedSubmission.timeSpent} minutes
                  </div>
                </div>
              </div>

              <div className="text-center text-secondary-600">
                <p>Detailed answer review would be displayed here</p>
                <p className="text-sm mt-2">This feature shows individual question responses and explanations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResults;