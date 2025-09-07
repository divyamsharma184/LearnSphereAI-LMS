import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { mockCourses } from '../../utils/mockData';
import toast from 'react-hot-toast';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = () => {
    // First check localStorage for created courses
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    let course = storedCourses.find(c => c.id === parseInt(id));
    
    // If not found in localStorage, check mock data
    if (!course) {
      course = mockCourses.find(c => c.id === parseInt(id));
    }

    if (course) {
      // Check if current user is the instructor
      if (course.instructorId !== user?.id) {
        toast.error('You are not authorized to edit this course');
        navigate('/courses');
        return;
      }

      setCourseData(course);
      setImagePreview(course.image);
      
      // Set modules or create default structure with proper validation
      if (course.modules && course.modules.length > 0) {
        // Ensure each module has lessons array
        const validatedModules = course.modules.map(module => ({
          ...module,
          lessons: module.lessons || [
            {
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
            }
          ]
        }));
        setModules(validatedModules);
      } else {
        setModules([
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
      }
    } else {
      toast.error('Course not found');
      navigate('/courses');
    }
    
    setLoading(false);
  };

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
      toast.success('Course image updated successfully!');
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
            lessons: (module.lessons || []).map(lesson =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ));
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
        ? { ...module, lessons: [...(module.lessons || []), newLesson] }
        : module
    ));
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: (module.lessons || []).filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const handleSaveCourse = () => {
    if (!courseData.title || !courseData.category || !courseData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedCourse = {
      ...courseData,
      modules: modules.filter(module => module.title),
      image: imagePreview,
      updatedAt: new Date().toISOString(),
    };

    // Update in localStorage if it's a created course
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const courseIndex = storedCourses.findIndex(c => c.id === parseInt(id));
    
    if (courseIndex !== -1) {
      storedCourses[courseIndex] = updatedCourse;
      localStorage.setItem('courses', JSON.stringify(storedCourses));
    }

    toast.success('Course updated successfully!');
    navigate('/courses');
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
                  Duration
                </label>
                <input
                  type="text"
                  value={lesson.duration}
                  onChange={(e) => handleLessonChange(moduleId, lesson.id, 'duration', e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., 15 min"
                />
              </div>
            </div>

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">Course not found</h3>
        <p className="text-secondary-600">The course you're looking for doesn't exist or you don't have permission to edit it.</p>
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
          <h1 className="text-2xl font-bold text-secondary-900">Edit Course</h1>
        </div>
        
        <button
          onClick={handleSaveCourse}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
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
              Update Course Thumbnail (Max 5MB)
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <div className="flex justify-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="course-image-edit"
                    />
                    <label
                      htmlFor="course-image-edit"
                      className="btn-primary cursor-pointer"
                    >
                      Change Image
                    </label>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setCourseImage(null);
                      }}
                      className="btn-secondary"
                    >
                      Remove Image
                    </button>
                  </div>
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
                    id="course-image-edit"
                  />
                  <label
                    htmlFor="course-image-edit"
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

      {/* Course Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Course Content</h2>
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

              {/* Lessons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-secondary-700">Lessons</h4>
                  <button
                    onClick={() => addLesson(module.id)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Lesson
                  </button>
                </div>

                {/* Add null check and default to empty array */}
                {(module.lessons || []).map((lesson, lessonIndex) => {
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
                        </div>
                        {(module.lessons || []).length > 1 && (
                          <button
                            onClick={() => removeLesson(module.id, lesson.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
                      </div>

                      {renderLessonContent(lesson, module.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
