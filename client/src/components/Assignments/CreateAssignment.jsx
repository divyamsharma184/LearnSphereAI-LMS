import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Plus,
  X,
  File,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    dueTime: '',
    maxPoints: 100,
    submissionType: 'file', // 'file', 'text', 'both'
    allowedFileTypes: ['.pdf', '.doc', '.docx'],
    maxFileSize: 10, // MB
    instructions: '',
    rubric: '',
    allowLateSubmissions: true,
    latePenalty: 10, // percentage per day
    groupAssignment: false,
    maxGroupSize: 4,
  });

  const [attachments, setAttachments] = useState([]);
  const [submissionGuidelines, setSubmissionGuidelines] = useState([
    { id: 1, text: 'Submit your work in the specified format' }
  ]);

  // Mock courses for instructor
  const instructorCourses = [
    { id: 1, title: 'Introduction to React' },
    { id: 2, title: 'Advanced JavaScript' },
    { id: 3, title: 'UI/UX Design Principles' },
  ];

  const submissionTypes = [
    { value: 'file', label: 'File Upload Only', description: 'Students upload documents, images, or other files' },
    { value: 'text', label: 'Text Entry Only', description: 'Students type their response directly' },
    { value: 'both', label: 'File Upload & Text Entry', description: 'Students can upload files and add text' },
  ];

  const fileTypes = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif',
    '.zip', '.rar', '.7z',
    '.ppt', '.pptx', '.xls', '.xlsx',
    '.mp4', '.mov', '.avi'
  ];

  const handleInputChange = (field, value) => {
    setAssignmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileTypeToggle = (fileType) => {
    setAssignmentData(prev => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter(type => type !== fileType)
        : [...prev.allowedFileTypes, fileType]
    }));
  };

  const handleAttachmentUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const addGuideline = () => {
    setSubmissionGuidelines(prev => [...prev, {
      id: Date.now(),
      text: ''
    }]);
  };

  const updateGuideline = (id, text) => {
    setSubmissionGuidelines(prev => prev.map(guideline =>
      guideline.id === id ? { ...guideline, text } : guideline
    ));
  };

  const removeGuideline = (id) => {
    if (submissionGuidelines.length > 1) {
      setSubmissionGuidelines(prev => prev.filter(guideline => guideline.id !== id));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveAssignment = () => {
    if (!assignmentData.title || !assignmentData.courseId || !assignmentData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock save operation
    const newAssignment = {
      id: Date.now(),
      ...assignmentData,
      instructorId: user?.id,
      instructor: user?.name,
      courseName: instructorCourses.find(c => c.id === parseInt(assignmentData.courseId))?.title,
      createdAt: new Date().toISOString(),
      attachments: attachments,
      submissionGuidelines: submissionGuidelines.filter(g => g.text),
      totalSubmissions: 0,
      gradedSubmissions: 0,
      averageGrade: 0,
    };

    // Add to localStorage for demo purposes
    const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    existingAssignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(existingAssignments));

    toast.success('Assignment created successfully!');
    navigate('/assignments');
  };

  const handleSaveDraft = () => {
    toast.success('Assignment saved as draft');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/assignments')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Assignment</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            className="btn-secondary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleSaveAssignment}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Publish Assignment</span>
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Assignment Title *
            </label>
            <input
              type="text"
              value={assignmentData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Course *
            </label>
            <select
              value={assignmentData.courseId}
              onChange={(e) => handleInputChange('courseId', e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a course</option>
              {instructorCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Maximum Points
            </label>
            <input
              type="number"
              min="1"
              value={assignmentData.maxPoints}
              onChange={(e) => handleInputChange('maxPoints', parseInt(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={assignmentData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Due Time
            </label>
            <input
              type="time"
              value={assignmentData.dueTime}
              onChange={(e) => handleInputChange('dueTime', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              value={assignmentData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="Describe the assignment objectives and requirements..."
            />
          </div>
        </div>
      </div>

      {/* Enhanced Submission Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Submission & Grading Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Submission Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {submissionTypes.map(type => (
                <label key={type.value} className="flex items-start p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50">
                  <input
                    type="radio"
                    name="submissionType"
                    value={type.value}
                    checked={assignmentData.submissionType === type.value}
                    onChange={(e) => handleInputChange('submissionType', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500 mr-3 mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-secondary-700">{type.label}</div>
                    <div className="text-xs text-secondary-500 mt-1">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {(assignmentData.submissionType === 'file' || assignmentData.submissionType === 'both') && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Allowed File Types
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {fileTypes.map(fileType => (
                    <label key={fileType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={assignmentData.allowedFileTypes.includes(fileType)}
                        onChange={() => handleFileTypeToggle(fileType)}
                        className="text-primary-600 focus:ring-primary-500 mr-2"
                      />
                      <span className="text-sm text-secondary-700">{fileType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={assignmentData.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  className="input-field w-32"
                />
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={assignmentData.allowLateSubmissions}
                onChange={(e) => handleInputChange('allowLateSubmissions', e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              Allow Late Submissions
            </label>

            {assignmentData.allowLateSubmissions && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-700">Penalty:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignmentData.latePenalty}
                  onChange={(e) => handleInputChange('latePenalty', parseInt(e.target.value))}
                  className="input-field w-20"
                />
                <span className="text-sm text-secondary-700">% per day</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={assignmentData.groupAssignment}
                onChange={(e) => handleInputChange('groupAssignment', e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              Group Assignment
            </label>

            {assignmentData.groupAssignment && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-700">Max group size:</span>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={assignmentData.maxGroupSize}
                  onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value))}
                  className="input-field w-20"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Guidelines */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Submission Guidelines</h2>
          <button
            onClick={addGuideline}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            + Add Guideline
          </button>
        </div>
        
        <div className="space-y-3">
          {submissionGuidelines.map((guideline, index) => (
            <div key={guideline.id} className="flex items-center space-x-3">
              <span className="text-sm text-secondary-600 w-6">{index + 1}.</span>
              <input
                type="text"
                value={guideline.text}
                onChange={(e) => updateGuideline(guideline.id, e.target.value)}
                className="input-field flex-1"
                placeholder="Enter submission guideline..."
              />
              {submissionGuidelines.length > 1 && (
                <button
                  onClick={() => removeGuideline(guideline.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions & Rubric */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Instructions & Grading</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Detailed Instructions
            </label>
            <textarea
              value={assignmentData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              className="input-field h-40 resize-none"
              placeholder="Provide detailed instructions for students on how to complete this assignment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Grading Rubric
            </label>
            <textarea
              value={assignmentData.rubric}
              onChange={(e) => handleInputChange('rubric', e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="Define the grading criteria and point distribution..."
            />
          </div>
        </div>
      </div>

      {/* Assignment Materials */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Assignment Materials</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Upload Files (Optional)
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-sm text-secondary-600 mb-2">
                Upload assignment materials, templates, or reference files
              </p>
              <input
                type="file"
                multiple
                onChange={handleAttachmentUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-primary cursor-pointer"
              >
                Choose Files
              </label>
            </div>
          </div>

          {attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-secondary-700 mb-2">Attached Files</h3>
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-secondary-600" />
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{attachment.name}</div>
                        <div className="text-xs text-secondary-600">{formatFileSize(attachment.size)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning for late submissions */}
      {assignmentData.allowLateSubmissions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Late Submission Policy</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Students will be penalized {assignmentData.latePenalty}% per day for late submissions.
                Make sure to communicate this policy clearly to your students.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAssignment;