import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Users,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Star,
  Filter,
  Search,
  Calendar,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

  // Mock assignment data
  const mockAssignment = {
    id: 1,
    title: 'React Todo App',
    courseName: 'Introduction to React',
    description: 'Build a complete todo application using React hooks and local storage.',
    maxPoints: 100,
    dueDate: '2024-02-20T23:59:00',
    submissionType: 'file',
    allowedFileTypes: ['.zip', '.rar'],
    createdAt: '2024-02-01T10:00:00',
  };

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 1,
      studentId: 5,
      studentName: 'John Smith',
      studentEmail: 'john.smith@student.learnsphere.com',
      submittedAt: '2024-02-18T14:30:00',
      status: 'submitted',
      isLate: false,
      files: [
        { name: 'todo-app.zip', size: 2048576, type: 'application/zip' }
      ],
      textSubmission: 'I have implemented all the required features including add, edit, delete, and mark as complete functionality.',
      grade: null,
      feedback: '',
      gradedAt: null,
      gradedBy: null,
    },
    {
      id: 2,
      studentId: 6,
      studentName: 'Jane Doe',
      studentEmail: 'jane.doe@student.learnsphere.com',
      submittedAt: '2024-02-19T16:45:00',
      status: 'graded',
      isLate: false,
      files: [
        { name: 'react-todo.zip', size: 1536000, type: 'application/zip' }
      ],
      textSubmission: 'Complete todo app with bonus features like filtering and local storage persistence.',
      grade: 95,
      feedback: 'Excellent work! Clean code structure and all requirements met. Bonus points for the additional features.',
      gradedAt: '2024-02-20T10:15:00',
      gradedBy: user?.name,
    },
    {
      id: 3,
      studentId: 7,
      studentName: 'Mike Johnson',
      studentEmail: 'mike.johnson@student.learnsphere.com',
      submittedAt: '2024-02-21T08:30:00',
      status: 'submitted',
      isLate: true,
      files: [
        { name: 'todo-project.zip', size: 1024000, type: 'application/zip' }
      ],
      textSubmission: 'Sorry for the late submission. Had some technical issues.',
      grade: null,
      feedback: '',
      gradedAt: null,
      gradedBy: null,
    },
    {
      id: 4,
      studentId: 8,
      studentName: 'Sarah Wilson',
      studentEmail: 'sarah.wilson@student.learnsphere.com',
      submittedAt: null,
      status: 'not-submitted',
      isLate: true,
      files: [],
      textSubmission: '',
      grade: null,
      feedback: '',
      gradedAt: null,
      gradedBy: null,
    },
  ];

  useEffect(() => {
    setAssignment(mockAssignment);
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
    const totalStudents = submissions.length;
    const submitted = submissions.filter(s => s.status !== 'not-submitted').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const late = submissions.filter(s => s.isLate && s.status !== 'not-submitted').length;
    const averageGrade = submissions.filter(s => s.grade !== null).length > 0
      ? submissions.filter(s => s.grade !== null).reduce((sum, s) => sum + s.grade, 0) / submissions.filter(s => s.grade !== null).length
      : 0;

    return {
      totalStudents,
      submitted,
      graded,
      late,
      submissionRate: (submitted / totalStudents) * 100,
      gradingProgress: (graded / submitted) * 100,
      averageGrade,
    };
  };

  const stats = getStatistics();

  const getStatusColor = (status, isLate) => {
    if (status === 'graded') return 'bg-green-100 text-green-800';
    if (status === 'submitted') return isLate ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status, isLate) => {
    if (status === 'graded') return 'Graded';
    if (status === 'submitted') return isLate ? 'Late Submission' : 'Submitted';
    return 'Not Submitted';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleGradeSubmission = () => {
    if (!gradeData.score || gradeData.score < 0 || gradeData.score > assignment.maxPoints) {
      toast.error(`Grade must be between 0 and ${assignment.maxPoints}`);
      return;
    }

    // Update submission with grade
    setSubmissions(prev => prev.map(s => 
      s.id === selectedSubmission.id 
        ? { 
            ...s, 
            grade: parseInt(gradeData.score), 
            feedback: gradeData.feedback,
            status: 'graded',
            gradedAt: new Date().toISOString(),
            gradedBy: user?.name
          }
        : s
    ));

    toast.success('Grade submitted successfully!');
    setSelectedSubmission(null);
    setGradeData({ score: '', feedback: '' });
  };

  const downloadSubmission = (submission) => {
    // Mock download functionality
    toast.success(`Downloading ${submission.studentName}'s submission...`);
  };

  const exportGrades = () => {
    // Mock export functionality
    const csvContent = [
      ['Student Name', 'Email', 'Status', 'Grade', 'Submitted At', 'Graded At'],
      ...filteredSubmissions.map(s => [
        s.studentName,
        s.studentEmail,
        getStatusLabel(s.status, s.isLate),
        s.grade || 'Not graded',
        s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'Not submitted',
        s.gradedAt ? new Date(s.gradedAt).toLocaleString() : 'Not graded'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assignment.title}_grades.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading assignment submissions...</p>
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
            to="/assignments"
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{assignment.title}</h1>
            <p className="text-secondary-600">{assignment.courseName}</p>
          </div>
        </div>
        
        <button
          onClick={exportGrades}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Grades</span>
        </button>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center text-secondary-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Due Date</span>
            </div>
            <p className="text-secondary-900">{new Date(assignment.dueDate).toLocaleString()}</p>
          </div>
          <div>
            <div className="flex items-center text-secondary-600 mb-2">
              <Star className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Max Points</span>
            </div>
            <p className="text-secondary-900">{assignment.maxPoints}</p>
          </div>
          <div>
            <div className="flex items-center text-secondary-600 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Submission Type</span>
            </div>
            <p className="text-secondary-900 capitalize">{assignment.submissionType}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Submission Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.submissionRate.toFixed(1)}%</p>
              <p className="text-xs text-secondary-500">{stats.submitted}/{stats.totalStudents} submitted</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Grading Progress</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.gradingProgress.toFixed(1)}%</p>
              <p className="text-xs text-secondary-500">{stats.graded}/{stats.submitted} graded</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Grade</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.averageGrade.toFixed(1)}</p>
              <p className="text-xs text-secondary-500">out of {assignment.maxPoints}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Late Submissions</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.late}</p>
              <p className="text-xs text-secondary-500">need attention</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
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
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="not-submitted">Not Submitted</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-secondary-600">
            <span>{filteredSubmissions.length} student{filteredSubmissions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Student</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-secondary-900">Grade</th>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status, submission.isLate)}`}>
                      {getStatusLabel(submission.status, submission.isLate)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {submission.grade !== null ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary-600">
                          {submission.grade}
                        </span>
                        <span className="text-sm text-secondary-600">
                          / {assignment.maxPoints}
                        </span>
                      </div>
                    ) : (
                      <span className="text-secondary-400">Not graded</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-secondary-600">
                    {submission.submittedAt 
                      ? new Date(submission.submittedAt).toLocaleString()
                      : '-'
                    }
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {submission.status !== 'not-submitted' && (
                        <>
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {submission.grade !== null ? 'Review' : 'Grade'}
                          </button>
                          <button
                            onClick={() => downloadSubmission(submission)}
                            className="flex items-center text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal - Completely Fixed */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setSelectedSubmission(null)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedSubmission.studentName}'s Submission
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Submission Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                      <p className="text-sm text-gray-900">
                        {selectedSubmission.submittedAt 
                          ? new Date(selectedSubmission.submittedAt).toLocaleString()
                          : 'Not submitted'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status, selectedSubmission.isLate)}`}>
                        {getStatusLabel(selectedSubmission.status, selectedSubmission.isLate)}
                      </span>
                    </div>
                  </div>

                  {/* Files */}
                  {selectedSubmission.files.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted Files</h4>
                      <div className="space-y-2">
                        {selectedSubmission.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Submission */}
                  {selectedSubmission.textSubmission && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Text Submission</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedSubmission.textSubmission}</p>
                      </div>
                    </div>
                  )}

                  {/* Grading Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Grading</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grade (out of {assignment.maxPoints})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={assignment.maxPoints}
                            value={gradeData.score || selectedSubmission.grade || ''}
                            onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter grade"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Grade</label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                            <span className="text-lg font-semibold text-blue-600">
                              {selectedSubmission.grade !== null ? `${selectedSubmission.grade}/${assignment.maxPoints}` : 'Not graded'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback
                        </label>
                        <textarea
                          value={gradeData.feedback || selectedSubmission.feedback || ''}
                          onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={4}
                          placeholder="Provide feedback to the student..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGradeSubmission}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {selectedSubmission.grade !== null ? 'Update Grade' : 'Submit Grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;