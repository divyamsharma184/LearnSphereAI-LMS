import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Bot, 
  FileQuestion, 
  MessageCircle, 
  Sparkles,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Upload,
  Settings
} from 'lucide-react';
import AITutor from './AITutor';
import AIQuizGenerator from './AIQuizGenerator';

const AIIntegration = ({ courseId }) => {
  const { user } = useSelector((state) => state.auth);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '');

  const loadAIStatus = async () => {
    if (!selectedCourseId) return;
    try {
      const response = await fetch(`/api/ai/status/${selectedCourseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiStatus(data.data);
      }
    } catch (error) {
      console.error('Error loading AI status:', error);
    }
  };

  React.useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('/api/courses', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : []);
          if (!selectedCourseId && Array.isArray(data) && data.length > 0) {
            setSelectedCourseId(data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    loadCourses();
  }, []);

  React.useEffect(() => {
    loadAIStatus();
  }, [selectedCourseId]);

  const getStatusColor = () => {
    if (!aiStatus) return 'text-gray-500';
    return aiStatus.aiEnabled ? 'text-green-600' : 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (!aiStatus) return <AlertCircle className="h-4 w-4" />;
    return aiStatus.aiEnabled ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!aiStatus) return 'Loading...';
    return aiStatus.aiEnabled ? 'AI Enabled' : 'AI Not Available';
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">AI Features</h3>
              <p className="text-sm text-secondary-600">Powered by OpenAI and LangChain</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              className="border border-secondary-300 rounded-md px-2 py-1 text-sm"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="" disabled>Select course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title || c.name || 'Course'}</option>
              ))}
            </select>
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {aiStatus && (
          <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-secondary-600" />
                <span className="text-secondary-600">
                  {aiStatus.documentCount} documents
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FileQuestion className="h-4 w-4 text-secondary-600" />
                <span className="text-secondary-600">
                  {aiStatus.totalWordCount.toLocaleString()} words
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary-600" />
                <span className="text-secondary-600">
                  {aiStatus.aiEnabled ? 'Ready' : 'Setup Required'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Tutor */}
          <div className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">AI Tutor</h4>
                <p className="text-sm text-secondary-600">Ask questions about course content</p>
              </div>
            </div>
            
            <p className="text-sm text-secondary-600 mb-4">
              Get instant answers to your questions using AI-powered analysis of course materials.
            </p>
            
            <button
              onClick={() => setShowAITutor(true)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                aiStatus?.aiEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
              }`}
            >
              {aiStatus?.aiEnabled ? 'Start Chat' : 'Upload Materials'}
            </button>
          </div>

          {/* AI Quiz Generator */}
          {user?.role === 'instructor' && (
            <div className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileQuestion className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Quiz Generator</h4>
                  <p className="text-sm text-secondary-600">Generate quiz questions automatically</p>
                </div>
              </div>
              
              <p className="text-sm text-secondary-600 mb-4">
                Create comprehensive quiz questions from course materials using AI.
              </p>
              
              <button
                onClick={() => setShowQuizGenerator(true)}
                disabled={!aiStatus?.aiEnabled}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  aiStatus?.aiEnabled
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                }`}
              >
                {aiStatus?.aiEnabled ? 'Generate Quiz' : 'Upload Materials First'}
              </button>
            </div>
          )}
        </div>

        {!aiStatus?.aiEnabled && user?.role === 'instructor' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Setup Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  To enable AI features, upload course materials (PDFs, documents, notes) first. 
                  The AI will analyze these materials to provide intelligent tutoring and quiz generation.
                </p>
              </div>
            </div>
          </div>
        )}

        {aiStatus?.aiEnabled && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800">AI Ready</h4>
                <p className="text-sm text-green-700 mt-1">
                  AI features are active and ready to use. Students can ask questions, 
                  and instructors can generate quizzes from the uploaded course materials.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Tutor Modal */}
      <AITutor
        courseId={selectedCourseId}
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
      />

      {/* AI Quiz Generator Modal */}
      {user?.role === 'instructor' && (
        <AIQuizGenerator
          courseId={selectedCourseId}
          isOpen={showQuizGenerator}
          onClose={() => setShowQuizGenerator(false)}
        />
      )}
    </>
  );
};

export default AIIntegration;
