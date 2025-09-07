import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  X,
  Calendar,
  Users,
  Clock,
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  Image,
  File,
  ExternalLink,
  Play,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import { eventBus, EVENTS } from '../../utils/eventBus';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    maxStudents: 50,
    startDate: '',
    endDate: '',
    price: 0,
    prerequisites: '',
    objectives: '',
    syllabus: '',
    image: null,
  });

  const [modules, setModules] = useState([
    {
      id: 1,
      title: '',
      description: '',
      lessons: [
        {
          id: 1,
          title: '',
          type: 'video',
          content: '',
          duration: '',
          videoUrl: '',
          videoFile: null,
          pdfFile: null,
          externalLink: '',
          liveSessionDate: '',
          liveSessionTime: '',
          liveSessionDuration: 60,
          liveSessionMeetingId: '',
          uploadProgress: 0,
          isUploading: false,
          isUploaded: false,
        }
      ]
    }
  ]);

  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const [submissionStatus, setSubmissionStatus] = useState('draft'); // draft, submitting, submitted

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Digital Marketing',
    'Business',
    'Programming',
    'Database',
    'Cybersecurity',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const lessonTypes = [
    { value: 'video', label: 'Video Lecture', icon: Video, description: 'Upload video files or link to video content' },
    { value: 'text', label: 'Text Content', icon: FileText, description: 'Written lesson content and materials' },
    { value: 'pdf', label: 'PDF Document', icon: File, description: 'Upload PDF documents and resources' },
    { value: 'link', label: 'External Link', icon: ExternalLink, description: 'Link to external resources and websites' },
    { value: 'live', label: 'Live Session', icon: Play, description: 'Schedule live teaching sessions with students' },
  ];

  const handleCourseDataChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image file size should be less than 5MB');
        return;
      }
      
      setCourseImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Course image uploaded successfully!');
    }
  };

  const handleModuleChange = (moduleId, field, value) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const handleLessonChange = (moduleId, lessonId, field, value) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ));
  };

  const handleVideoUpload = async (moduleId, lessonId, file) => {
    if (!file) return;
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('Video file size should be less than 100MB');
      return;
    }

    const fileId = `${moduleId}-${lessonId}-video`;
    setUploadingFiles(prev => new Set([...prev, fileId]));
    
    // Update lesson state to show uploading
    handleLessonChange(moduleId, lessonId, 'isUploading', true);
    handleLessonChange(moduleId, lessonId, 'uploadProgress', 0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      handleLessonChange(moduleId, lessonId, 'uploadProgress', prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          handleLessonChange(moduleId, lessonId, 'isUploading', false);
          handleLessonChange(moduleId, lessonId, 'isUploaded', true);
          handleLessonChange(moduleId, lessonId, 'videoFile', file);
          setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileId);
            return newSet;
          });
          toast.success('Video uploaded successfully!');
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handlePdfUpload = async (moduleId, lessonId, file) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('PDF file size should be less than 10MB');
      return;
    }

    const fileId = `${moduleId}-${lessonId}-pdf`;
    setUploadingFiles(prev => new Set([...prev, fileId]));
    
    // Update lesson state
    handleLessonChange(moduleId, lessonId, 'isUploading', true);
    handleLessonChange(moduleId, lessonId, 'uploadProgress', 0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      handleLessonChange(moduleId, lessonId, 'uploadProgress', prev => {
        const newProgress = prev + 15;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          handleLessonChange(moduleId, lessonId, 'isUploading', false);
          handleLessonChange(moduleId, lessonId, 'isUploaded', true);
          handleLessonChange(moduleId, lessonId, 'pdfFile', file);
          setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileId);
            return newSet;
          });
          toast.success('PDF uploaded successfully!');
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: '',
      description: '',
      lessons: [
        {
          id: Date.now() + 1,
          title: '',
          type: 'video',
          content: '',
          duration: '',
          videoUrl: '',
          videoFile: null,
          pdfFile: null,
          externalLink: '',
          liveSessionDate: '',
          liveSessionTime: '',
          liveSessionDuration: 60,
          liveSessionMeetingId: '',
          uploadProgress: 0,
          isUploading: false,
          isUploaded: false,
        }
      ]
    };
    setModules(prev => [...prev, newModule]);
  };

  const removeModule = (moduleId) => {
    if (modules.length > 1) {
      setModules(prev => prev.filter(module => module.id !== moduleId));
    }
  };

  const addLesson = (moduleId) => {
    const newLesson = {
      id: Date.now(),
      title: '',
      type: 'video',
      content: '',
      duration: '',
      videoUrl: '',
      videoFile: null,
      pdfFile: null,
      externalLink: '',
      liveSessionDate: '',
      liveSessionTime: '',
      liveSessionDuration: 60,
      liveSessionMeetingId: '',
      uploadProgress: 0,
      isUploading: false,
      isUploaded: false,
    };
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const duplicateLesson = (moduleId, lessonId) => {
    const lessonToDuplicate = modules
      .find(m => m.id === moduleId)
      ?.lessons.find(l => l.id === lessonId);
    
    if (lessonToDuplicate) {
      const duplicatedLesson = {
        ...lessonToDuplicate,
        id: Date.now(),
        title: lessonToDuplicate.title + ' (Copy)',
        isUploading: false,
        uploadProgress: 0,
      };
      
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, lessons: [...module.lessons, duplicatedLesson] }
          : module
      ));
    }
  };

  // UPDATED: Submit course for admin approval instead of direct publishing
  const handleSubmitForApproval = () => {
    if (!courseData.title || !courseData.category || !courseData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate that at least one module has content
    const hasContent = modules.some(module => 
      module.title && module.lessons.some(lesson => 
        lesson.title && (lesson.content || lesson.videoUrl || lesson.videoFile || lesson.pdfFile || lesson.externalLink)
      )
    );

    if (!hasContent) {
      toast.error('Please add at least one module with content');
      return;
    }

    setSubmissionStatus('submitting');

    // Create course object for admin approval
    const newCourse = {
      id: Date.now(),
      ...courseData,
      instructor: user?.name,
      instructorId: user?.id,
      enrolledStudents: 0,
      status: 'pending', // Changed from 'active' to 'pending'
      submittedAt: new Date().toISOString(), // Add submission timestamp
      submittedBy: user?.name,
      modules: modules.filter(module => module.title),
      image: imagePreview || 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
    };

    // Add to pending courses for admin approval
    const pendingCourses = JSON.parse(localStorage.getItem('pendingCourses') || '[]');
    pendingCourses.push(newCourse);
    localStorage.setItem('pendingCourses', JSON.stringify(pendingCourses));

    // Emit event for real-time updates
    eventBus.emit(EVENTS.COURSE_CREATED, newCourse);

    setSubmissionStatus('submitted');
    toast.success('Course submitted for admin approval!');
    
    // Show success message and redirect after delay
    setTimeout(() => {
      navigate('/courses');
    }, 2000);
  };

  const handleSaveDraft = () => {
    // Save as draft in localStorage
    const draftCourse = {
      id: Date.now(),
      ...courseData,
      instructor: user?.name,
      instructorId: user?.id,
      status: 'draft',
      modules: modules.filter(module => module.title),
      image: imagePreview,
      savedAt: new Date().toISOString(),
    };

    const drafts = JSON.parse(localStorage.getItem('courseDrafts') || '[]');
    drafts.push(draftCourse);
    localStorage.setItem('courseDrafts', JSON.stringify(drafts));

    toast.success('Course saved as draft');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderLessonContent = (lesson, moduleId) => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <input
                  type="url"
                  value={lesson.videoUrl || ''}
                  onChange={(e) => handleLessonChange(moduleId, lesson.id, 'videoUrl', e.target.value)}
                  className="input-field text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Or Upload Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(moduleId, lesson.id, e.target.files[0])}
                  className="input-field text-sm"
                  disabled={lesson.isUploading}
                />
              </div>
            </div>

            {lesson.isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Uploading video...</span>
                  <span className="text-sm text-blue-700">{lesson.uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${lesson.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {lesson.isUploaded && lesson.videoFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Video uploaded successfully</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600">{formatFileSize(lesson.videoFile.size)}</span>
                    <button
                      onClick={() => handleLessonChange(moduleId, lesson.id, 'videoFile', null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                Video Description
              </label>
              <textarea
                value={lesson.content}
                onChange={(e) => handleLessonChange(moduleId, lesson.id, 'content', e.target.value)}
                className="input-field text-sm h-20 resize-none"
                placeholder="Describe what students will learn in this video..."
              />
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                Upload PDF Document
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handlePdfUpload(moduleId, lesson.id, e.target.files[0])}
                className="input-field text-sm"
                disabled={lesson.isUploading}
              />
            </div>

            {lesson.isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Uploading PDF...</span>
                  <span className="text-sm text-blue-700">{lesson.uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${lesson.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {lesson.isUploaded && lesson.pdfFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{lesson.pdfFile.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600">{formatFileSize(lesson.pdfFile.size)}</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleLessonChange(moduleId, lesson.id, 'pdfFile', null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                Document Description
              </label>
              <textarea
                value={lesson.content}
                onChange={(e) => handleLessonChange(moduleId, lesson.id, 'content', e.target.value)}
                className="input-field text-sm h-20 resize-none"
                placeholder="Describe the content of this document..."
              />
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                External Link URL
              </label>
              <input
                type="url"
                value={lesson.externalLink || ''}
                onChange={(e) => handleLessonChange(moduleId, lesson.id, 'externalLink', e.target.value)}
                className="input-field text-sm"
                placeholder="https://example.com/resource"
              />
            </div>

            {lesson.externalLink && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">External Resource</span>
                  </div>
                  <a
                    href={lesson.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Preview Link
                  </a>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                Link Description
              </label>
              <textarea
                value={lesson.content}
                onChange={(e) => handleLessonChange(moduleId, lesson.id, 'content', e.target.value)}
                className="input-field text-sm h-20 resize-none"
                placeholder="Explain what students will find at this link..."
              />
            </div>
          </div>
        );

      case 'live':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Session Date
                </label>
                <input
                  type="date"
                  value={lesson.liveSessionDate || ''}
                  onChange={(e) => handleLessonChange(moduleId, lesson.id, 'liveSessionDate', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Session Time
                </label>
                <input
                  type="time"
                  value={lesson.liveSessionTime || ''}
                  onChange={(e) => handleLessonChange(moduleId, lesson.id, 'liveSessionTime', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={lesson.liveSessionDuration || 60}
                  onChange={(e) => handleLessonChange(moduleId, lesson.id, 'liveSessionDuration', parseInt(e.target.value))}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-2">
                  Meeting ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={lesson.liveSessionMeetingId || ''}
                    onChange={(e) => handleLessonChange(moduleId, lesson.id, 'liveSessionMeetingId', e.target.value)}
                    className="input-field text-sm flex-1"
                    placeholder="Auto-generated"
                    readOnly
                  />
                  <button
                    onClick={() => handleLessonChange(moduleId, lesson.id, 'liveSessionMeetingId', generateMeetingId())}
                    className="btn-secondary text-sm px-3"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {lesson.liveSessionDate && lesson.liveSessionTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    Live session scheduled for {new Date(lesson.liveSessionDate + 'T' + lesson.liveSessionTime).toLocaleString()}
                  </span>
                </div>
                {lesson.liveSessionMeetingId && (
                  <div className="mt-2 text-xs text-green-600">
                    Meeting ID: {lesson.liveSessionMeetingId}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-2">
                Session Agenda
              </label>
              <textarea
                value={lesson.content}
                onChange={(e) => handleLessonChange(moduleId, lesson.id, 'content', e.target.value)}
                className="input-field text-sm h-20 resize-none"
                placeholder="What will be covered in this live session?"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-2">
              Lesson Content
            </label>
            <textarea
              value={lesson.content}
              onChange={(e) => handleLessonChange(moduleId, lesson.id, 'content', e.target.value)}
              className="input-field text-sm h-24 resize-none"
              placeholder="Enter the lesson content..."
            />
          </div>
        );
    }
  };

  // Show submission success state
  if (submissionStatus === 'submitted') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Course Submitted Successfully!</h2>
          <p className="text-secondary-600 mb-6">
            Your course "{courseData.title}" has been submitted for admin approval. 
            You will be notified once the review is complete.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Admin will review your course content and structure</li>
              <li>• You'll receive notification about approval status</li>
              <li>• Once approved, students can enroll in your course</li>
              <li>• You can make updates to approved courses anytime</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Course</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            className="btn-secondary flex items-center space-x-2"
            disabled={submissionStatus === 'submitting'}
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleSubmitForApproval}
            className="btn-primary flex items-center space-x-2"
            disabled={submissionStatus === 'submitting'}
          >
            {submissionStatus === 'submitting' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit for Approval</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Admin Approval Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Course Approval Process</h3>
            <p className="text-sm text-blue-700 mt-1">
              All new courses must be approved by an administrator before they become available to students. 
              This ensures quality and consistency across our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => handleCourseDataChange('title', e.target.value)}
              className="input-field"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Category *
            </label>
            <select
              value={courseData.category}
              onChange={(e) => handleCourseDataChange('category', e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Level
            </label>
            <select
              value={courseData.level}
              onChange={(e) => handleCourseDataChange('level', e.target.value)}
              className="input-field"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={courseData.duration}
              onChange={(e) => handleCourseDataChange('duration', e.target.value)}
              className="input-field"
              placeholder="e.g., 8 weeks, 40 hours"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Maximum Students
            </label>
            <input
              type="number"
              min="1"
              value={courseData.maxStudents}
              onChange={(e) => handleCourseDataChange('maxStudents', parseInt(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={courseData.startDate}
              onChange={(e) => handleCourseDataChange('startDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={courseData.endDate}
              onChange={(e) => handleCourseDataChange('endDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Course Description *
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => handleCourseDataChange('description', e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="Describe what students will learn in this course..."
              required
            />
          </div>
        </div>
      </div>

      {/* Course Image */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Course Image</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Upload Course Thumbnail (Max 5MB)
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setCourseImage(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <Image className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 mb-2">
                    Upload a course thumbnail image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="course-image"
                  />
                  <label
                    htmlFor="course-image"
                    className="btn-primary cursor-pointer"
                  >
                    Choose Image
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Course Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Interactive Course Content</h2>
            <p className="text-sm text-secondary-600 mt-1">
              Create engaging content with videos, PDFs, external links, and live sessions
            </p>
          </div>
          <button
            onClick={addModule}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Module</span>
          </button>
        </div>

        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="border border-secondary-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-secondary-900">
                  Module {moduleIndex + 1}
                </h3>
                {modules.length > 1 && (
                  <button
                    onClick={() => removeModule(module.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Module Title
                  </label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)}
                    className="input-field"
                    placeholder="Enter module title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Module Description
                  </label>
                  <input
                    type="text"
                    value={module.description}
                    onChange={(e) => handleModuleChange(module.id, 'description', e.target.value)}
                    className="input-field"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              {/* Interactive Lessons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-secondary-700">Interactive Lessons</h4>
                  <button
                    onClick={() => addLesson(module.id)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Lesson
                  </button>
                </div>

                {module.lessons.map((lesson, lessonIndex) => {
                  const selectedType = lessonTypes.find(type => type.value === lesson.type);
                  const TypeIcon = selectedType?.icon || Video;
                  
                  return (
                    <div key={lesson.id} className="bg-secondary-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium text-secondary-700">
                            Lesson {lessonIndex + 1}
                          </span>
                          {lesson.isUploaded && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => duplicateLesson(module.id, lesson.id)}
                            className="text-secondary-600 hover:text-secondary-700"
                            title="Duplicate Lesson"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          {module.lessons.length > 1 && (
                            <button
                              onClick={() => removeLesson(module.id, lesson.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(module.id, lesson.id, 'title', e.target.value)}
                            className="input-field text-sm"
                            placeholder="Lesson title"
                          />
                        </div>
                        <div>
                          <select
                            value={lesson.type}
                            onChange={(e) => handleLessonChange(module.id, lesson.id, 'type', e.target.value)}
                            className="input-field text-sm"
                          >
                            {lessonTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(module.id, lesson.id, 'duration', e.target.value)}
                            className="input-field text-sm"
                            placeholder="Duration (e.g., 15 min)"
                          />
                        </div>
                      </div>

                      {/* Content type description */}
                      <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <strong>{selectedType?.label}:</strong> {selectedType?.description}
                      </div>

                      {/* Dynamic content based on lesson type */}
                      {renderLessonContent(lesson, module.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Additional Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Prerequisites
            </label>
            <textarea
              value={courseData.prerequisites}
              onChange={(e) => handleCourseDataChange('prerequisites', e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="What should students know before taking this course?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Learning Objectives
            </label>
            <textarea
              value={courseData.objectives}
              onChange={(e) => handleCourseDataChange('objectives', e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="What will students learn? List the key learning outcomes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Detailed Syllabus
            </label>
            <textarea
              value={courseData.syllabus}
              onChange={(e) => handleCourseDataChange('syllabus', e.target.value)}
              className="input-field h-40 resize-none"
              placeholder="Provide a detailed breakdown of topics covered in each week/module..."
            />
          </div>
        </div>
      </div>

      {/* Upload Progress Summary */}
      {uploadingFiles.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Upload in Progress</h3>
          </div>
          <p className="text-sm text-blue-700">
            {uploadingFiles.size} file{uploadingFiles.size !== 1 ? 's' : ''} currently uploading...
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
