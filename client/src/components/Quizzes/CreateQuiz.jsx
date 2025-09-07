import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  Clock,
  Calendar,
  FileQuestion,
  CheckCircle,
  X,
} from 'lucide-react';
import { eventBus, EVENTS } from '../../utils/eventBus';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    courseId: '',
    timeLimit: 30,
    maxAttempts: 3,
    dueDate: '',
    instructions: '',
    shuffleQuestions: false,
    showResults: true,
    passingScore: 70,
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: '',
    }
  ]);

  const [previewMode, setPreviewMode] = useState(false);

  // Mock courses for instructor
  const instructorCourses = [
    { id: 1, title: 'Introduction to React' },
    { id: 2, title: 'Advanced JavaScript' },
    { id: 3, title: 'UI/UX Design Principles' },
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
  ];

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: '',
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const duplicateQuestion = (questionId) => {
    const questionToDuplicate = questions.find(q => q.id === questionId);
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: Date.now(),
      question: questionToDuplicate.question + ' (Copy)',
    };
    setQuestions(prev => [...prev, duplicatedQuestion]);
  };

  const handleSaveQuiz = () => {
    if (!quizData.title || !quizData.courseId || questions.some(q => !q.question)) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create new quiz object
    const newQuiz = {
      id: Date.now(),
      ...quizData,
      questions: questions.filter(q => q.question.trim() !== ''),
      instructorId: user?.id,
      instructor: user?.name,
      courseName: instructorCourses.find(c => c.id === parseInt(quizData.courseId))?.title,
      createdAt: new Date().toISOString(),
      totalSubmissions: 0,
      averageScore: 0,
      status: 'active',
    };

    // Save to localStorage
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    existingQuizzes.push(newQuiz);
    localStorage.setItem('quizzes', JSON.stringify(existingQuizzes));

    // Emit event for real-time updates
    eventBus.emit(EVENTS.QUIZ_CREATED, newQuiz);

    toast.success('Quiz created successfully!');
    navigate('/quizzes');
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const getTotalPoints = () => {
    return questions.reduce((total, q) => total + q.points, 0);
  };

  const renderQuestionEditor = (question, index) => (
    <div key={question.id} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">
          Question {index + 1}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => duplicateQuestion(question.id)}
            className="p-2 text-secondary-600 hover:text-secondary-900 rounded-lg hover:bg-secondary-100"
            title="Duplicate Question"
          >
            <Plus className="h-4 w-4" />
          </button>
          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(question.id)}
              className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
              title="Delete Question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
            className="input-field"
          >
            {questionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Points
          </label>
          <input
            type="number"
            min="1"
            value={question.points}
            onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.question}
          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
          className="input-field h-24 resize-none"
          placeholder="Enter your question here..."
          required
        />
      </div>

      {question.type === 'multiple-choice' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Answer Options
          </label>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => handleQuestionChange(question.id, 'correctAnswer', optionIndex)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Option ${optionIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {question.type === 'true-false' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Correct Answer
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={`tf-${question.id}`}
                checked={question.correctAnswer === true}
                onChange={() => handleQuestionChange(question.id, 'correctAnswer', true)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              True
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`tf-${question.id}`}
                checked={question.correctAnswer === false}
                onChange={() => handleQuestionChange(question.id, 'correctAnswer', false)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              False
            </label>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) => handleQuestionChange(question.id, 'explanation', e.target.value)}
          className="input-field h-20 resize-none"
          placeholder="Explain why this is the correct answer..."
        />
      </div>
    </div>
  );

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </button>
          <div className="text-sm text-secondary-600">
            Preview Mode
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">{quizData.title}</h1>
            <p className="text-secondary-600 mb-4">{quizData.description}</p>
            <div className="flex justify-center space-x-6 text-sm text-secondary-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{quizData.timeLimit} minutes</span>
              </div>
              <div className="flex items-center">
                <FileQuestion className="h-4 w-4 mr-1" />
                <span>{questions.length} questions</span>
              </div>
              <div>
                <span>{getTotalPoints()} points total</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-secondary-200 rounded-lg p-6">
                <h3 className="font-medium text-secondary-900 mb-4">
                  {index + 1}. {question.question}
                </h3>
                
                {question.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`preview-${question.id}`}
                          className="text-primary-600 focus:ring-primary-500 mr-3"
                          disabled
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name={`preview-${question.id}`} className="mr-3" disabled />
                      True
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name={`preview-${question.id}`} className="mr-3" disabled />
                      False
                    </label>
                  </div>
                )}

                <div className="mt-4 text-sm text-secondary-600">
                  Points: {question.points}
                </div>
              </div>
            ))}
          </div>
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
            onClick={() => navigate('/quizzes')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Quiz</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="btn-secondary flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSaveQuiz}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Quiz</span>
          </button>
        </div>
      </div>

      {/* Quiz Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Quiz Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => handleQuizDataChange('title', e.target.value)}
              className="input-field"
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Course *
            </label>
            <select
              value={quizData.courseId}
              onChange={(e) => handleQuizDataChange('courseId', e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a course</option>
              {instructorCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              value={quizData.description}
              onChange={(e) => handleQuizDataChange('description', e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Describe what this quiz covers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={quizData.timeLimit}
              onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
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
              value={quizData.maxAttempts}
              onChange={(e) => handleQuizDataChange('maxAttempts', parseInt(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={quizData.dueDate}
              onChange={(e) => handleQuizDataChange('dueDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={quizData.passingScore}
              onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value))}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Instructions
            </label>
            <textarea
              value={quizData.instructions}
              onChange={(e) => handleQuizDataChange('instructions', e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Special instructions for students..."
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizData.shuffleQuestions}
                onChange={(e) => handleQuizDataChange('shuffleQuestions', e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              Shuffle Questions
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizData.showResults}
                onChange={(e) => handleQuizDataChange('showResults', e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 mr-2"
              />
              Show Results After Submission
            </label>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900">
            Questions ({questions.length}) - {getTotalPoints()} points total
          </h2>
          <button
            onClick={addQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((question, index) => renderQuestionEditor(question, index))}
      </div>
    </div>
  );
};

export default CreateQuiz;
