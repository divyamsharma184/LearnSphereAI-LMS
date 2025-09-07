import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FileQuestion,
  Plus,
  Save,
  Download,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  Award,
  Users,
  BookOpen,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIQuizGenerator = ({ courseId, isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [aiStatus, setAiStatus] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [quizSettings, setQuizSettings] = useState({
    numQuestions: 5,
    difficulty: 'medium',
    questionType: 'mixed',
    timeLimit: 30,
    maxAttempts: 3,
  });
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAIStatus();
    }
  }, [isOpen, courseId]);

  const loadAIStatus = async () => {
    try {
      const response = await fetch(`/api/ai/status/${courseId}`, {
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

  const generateQuiz = async () => {
    if (!aiStatus?.aiEnabled) {
      toast.error('AI is not available. Please upload course materials first.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/ai/generate-quiz/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          numQuestions: quizSettings.numQuestions,
          difficulty: quizSettings.difficulty,
          questionType: quizSettings.questionType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedQuestions(data.data.questions);
        toast.success(`Generated ${data.data.questions.length} questions successfully!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate quiz questions');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (generatedQuestions.length === 0) {
      toast.error('No questions to save');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/ai/save-quiz/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: quizTitle,
          description: quizDescription,
          questions: generatedQuestions,
          timeLimit: quizSettings.timeLimit,
          maxAttempts: quizSettings.maxAttempts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Quiz saved successfully!');
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const editQuestion = (index) => {
    setEditingQuestion({ index, question: generatedQuestions[index] });
  };

  const updateQuestion = (index, updatedQuestion) => {
    setGeneratedQuestions(prev => 
      prev.map((q, i) => i === index ? updatedQuestion : q)
    );
    setEditingQuestion(null);
  };

  const deleteQuestion = (index) => {
    setGeneratedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple-choice': return '🔘';
      case 'true-false': return '✅';
      case 'short-answer': return '✏️';
      case 'essay': return '📝';
      default: return '❓';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileQuestion className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">AI Quiz Generator</h2>
              <p className="text-sm text-secondary-600">Generate quiz questions from course content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Status */}
        {aiStatus && (
          <div className="p-4 bg-secondary-50 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {aiStatus.aiEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">
                    {aiStatus.aiEnabled ? 'AI Enabled' : 'AI Not Available'}
                  </span>
                </div>
                {aiStatus.aiEnabled && (
                  <div className="text-sm text-secondary-600">
                    {aiStatus.documentCount} documents • {aiStatus.totalWordCount.toLocaleString()} words
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quiz Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quiz Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={quizSettings.numQuestions}
                      onChange={(e) => setQuizSettings(prev => ({
                        ...prev,
                        numQuestions: parseInt(e.target.value)
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={quizSettings.difficulty}
                      onChange={(e) => setQuizSettings(prev => ({
                        ...prev,
                        difficulty: e.target.value
                      }))}
                      className="input-field"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={quizSettings.questionType}
                      onChange={(e) => setQuizSettings(prev => ({
                        ...prev,
                        questionType: e.target.value
                      }))}
                      className="input-field"
                    >
                      <option value="mixed">Mixed</option>
                      <option value="multipleChoice">Multiple Choice</option>
                      <option value="trueFalse">True/False</option>
                      <option value="shortAnswer">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={quizSettings.timeLimit}
                      onChange={(e) => setQuizSettings(prev => ({
                        ...prev,
                        timeLimit: parseInt(e.target.value)
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Max Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quizSettings.maxAttempts}
                      onChange={(e) => setQuizSettings(prev => ({
                        ...prev,
                        maxAttempts: parseInt(e.target.value)
                      }))}
                      className="input-field"
                    />
                  </div>

                  <button
                    onClick={generateQuiz}
                    disabled={!aiStatus?.aiEnabled || isGenerating}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>{isGenerating ? 'Generating...' : 'Generate Questions'}</span>
                  </button>
                </div>
              </div>

              {/* Quiz Details */}
              {generatedQuestions.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Quiz Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Enter quiz title..."
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        placeholder="Enter quiz description..."
                        rows="3"
                        className="input-field"
                      />
                    </div>

                    <button
                      onClick={saveQuiz}
                      disabled={!quizTitle.trim() || isSaving}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Quiz'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Questions */}
            <div className="lg:col-span-2">
              {generatedQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <FileQuestion className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No questions generated yet
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    Configure your settings and click "Generate Questions" to create AI-powered quiz questions.
                  </p>
                  {!aiStatus?.aiEnabled && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          AI Quiz Generator is not available. Course materials need to be uploaded first.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-secondary-900">
                      Generated Questions ({generatedQuestions.length})
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Clock className="h-4 w-4" />
                      <span>{quizSettings.timeLimit} min</span>
                      <Award className="h-4 w-4 ml-2" />
                      <span>{generatedQuestions.reduce((sum, q) => sum + q.points, 0)} pts</span>
                    </div>
                  </div>

                  {generatedQuestions.map((question, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-secondary-900">
                                Question {index + 1}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </span>
                              <span className="text-xs text-secondary-500">
                                {question.points} pt{question.points !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editQuestion(index)}
                            className="p-2 text-secondary-600 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                            title="Edit Question"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(index)}
                            className="p-2 text-secondary-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-secondary-900 font-medium mb-3">{question.question}</p>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <span className="text-sm text-secondary-600">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className={`text-sm ${
                                  option === question.correctAnswer 
                                    ? 'text-green-600 font-medium' 
                                    : 'text-secondary-700'
                                }`}>
                                  {option}
                                </span>
                                {option === question.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-secondary-600">Answer:</span>
                            <span className={`text-sm font-medium ${
                              question.correctAnswer ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {question.correctAnswer ? 'True' : 'False'}
                            </span>
                          </div>
                        )}

                        {question.type === 'short-answer' && (
                          <div className="bg-secondary-50 rounded-lg p-3">
                            <span className="text-sm text-secondary-600">Expected Answer:</span>
                            <p className="text-sm text-secondary-900 mt-1">{question.correctAnswer}</p>
                          </div>
                        )}
                      </div>

                      {question.explanation && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-blue-900">Explanation:</span>
                          <p className="text-sm text-blue-800 mt-1">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuizGenerator;
