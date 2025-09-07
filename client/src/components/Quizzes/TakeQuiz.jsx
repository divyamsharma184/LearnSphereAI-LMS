import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Flag,
  Save,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  // Mock quiz data
  const mockQuiz = {
    id: 1,
    title: 'React Fundamentals Quiz',
    description: 'Test your knowledge of React basics including components, props, and state.',
    courseName: 'Introduction to React',
    timeLimit: 30, // minutes
    maxAttempts: 3,
    attempts: 0,
    passingScore: 70,
    instructions: 'Read each question carefully. You can navigate between questions and flag questions for review. Make sure to submit your quiz before time runs out.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is React?',
        options: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A server-side programming language',
          'A CSS framework'
        ],
        correctAnswer: 0,
        points: 5,
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which method is used to create components in React?',
        options: [
          'React.createComponent()',
          'React.createElement()',
          'React.component()',
          'React.makeComponent()'
        ],
        correctAnswer: 1,
        points: 5,
        explanation: 'React.createElement() is the fundamental method used to create React elements, though JSX is more commonly used in practice.'
      },
      {
        id: 3,
        type: 'true-false',
        question: 'React components must always return a single parent element.',
        options: ['True', 'False'],
        correctAnswer: 1,
        points: 5,
        explanation: 'False. With React Fragments or React 16+, components can return multiple elements without a single parent wrapper.'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'What is the purpose of the useState hook?',
        options: [
          'To manage component lifecycle',
          'To handle side effects',
          'To manage component state',
          'To optimize performance'
        ],
        correctAnswer: 2,
        points: 5,
        explanation: 'useState is a React hook that allows you to add state to functional components.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'Which of the following is NOT a valid way to pass data to a React component?',
        options: [
          'Props',
          'State',
          'Context',
          'Variables'
        ],
        correctAnswer: 3,
        points: 5,
        explanation: 'While variables can be used within components, they are not a React-specific way to pass data between components like props, state, and context are.'
      }
    ]
  };

  useEffect(() => {
    setQuiz(mockQuiz);
    setQuestions(mockQuiz.questions);
    setTimeRemaining(mockQuiz.timeLimit * 60); // Convert to seconds
  }, [id]);

  useEffect(() => {
    let timer;
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setShowInstructions(false);
    toast.success('Quiz started! Good luck!');
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
        toast.info('Question unflagged');
      } else {
        newSet.add(questionId);
        toast.info('Question flagged for review');
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          if (userAnswer === question.correctAnswer) {
            totalScore += question.points;
          }
        }
      }
    });

    return {
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100)
    };
  };

  const handleSubmitQuiz = (autoSubmit = false) => {
    if (!autoSubmit) {
      const unansweredQuestions = questions.filter(q => answers[q.id] === undefined);
      if (unansweredQuestions.length > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
      }
    }

    const result = calculateScore();
    setScore(result);
    setQuizSubmitted(true);
    setShowResults(true);

    // Save quiz result to localStorage
    const quizResult = {
      quizId: quiz.id,
      userId: user?.id,
      answers,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      timeSpent: (quiz.timeLimit * 60) - timeRemaining,
      submittedAt: new Date().toISOString(),
      passed: result.percentage >= quiz.passingScore
    };

    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    existingResults.push(quizResult);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));

    if (autoSubmit) {
      toast.error('Time\'s up! Quiz submitted automatically.');
    } else {
      toast.success('Quiz submitted successfully!');
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getQuestionStatus = (questionId) => {
    if (answers[questionId] !== undefined) {
      return 'answered';
    }
    if (flaggedQuestions.has(questionId)) {
      return 'flagged';
    }
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'flagged': return 'bg-yellow-500 text-white';
      default: return 'bg-secondary-200 text-secondary-700';
    }
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show results after submission
  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/quizzes')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            score.percentage >= quiz.passingScore ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {score.percentage >= quiz.passingScore ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Quiz Completed!</h2>
          <p className="text-secondary-600 mb-6">
            {score.percentage >= quiz.passingScore ? 'Congratulations! You passed the quiz.' : 'You did not meet the passing score. You can retake the quiz.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600">{score.percentage}%</div>
              <div className="text-sm text-secondary-600">Your Score</div>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-secondary-900">{score.score}/{score.maxScore}</div>
              <div className="text-sm text-secondary-600">Points Earned</div>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-secondary-900">{quiz.passingScore}%</div>
              <div className="text-sm text-secondary-600">Passing Score</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Question Review</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border border-secondary-200 rounded-lg p-4 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-secondary-900">
                        {index + 1}. {question.question}
                      </h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                    
                    <div className="text-sm text-secondary-600 mb-2">
                      <strong>Your answer:</strong> {
                        userAnswer !== undefined 
                          ? question.options[userAnswer] 
                          : 'Not answered'
                      }
                    </div>
                    
                    <div className="text-sm text-green-600 mb-2">
                      <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                    </div>
                    
                    {question.explanation && (
                      <div className="text-sm text-secondary-600 bg-secondary-50 p-2 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => navigate('/quizzes')}
              className="btn-primary"
            >
              Back to Quizzes
            </button>
            {score.percentage < quiz.passingScore && quiz.attempts < quiz.maxAttempts && (
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show instructions before starting
  if (showInstructions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/quizzes')}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
          <div className="text-center mb-8">
            <FileQuestion className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">{quiz.title}</h1>
            <p className="text-secondary-600">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-secondary-900">{quiz.timeLimit} minutes</div>
              <div className="text-sm text-secondary-600">Time Limit</div>
            </div>
            <div className="text-center">
              <FileQuestion className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-secondary-900">{quiz.questions.length} questions</div>
              <div className="text-sm text-secondary-600">Total Questions</div>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-secondary-900">{quiz.passingScore}%</div>
              <div className="text-sm text-secondary-600">Passing Score</div>
            </div>
          </div>

          <div className="bg-secondary-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-secondary-900 mb-3">Instructions</h3>
            <p className="text-secondary-700 mb-4">{quiz.instructions}</p>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li>• You can navigate between questions using the navigation buttons</li>
              <li>• Flag questions for review if you're unsure</li>
              <li>• Your progress is automatically saved</li>
              <li>• Submit your quiz before time runs out</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartQuiz}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Header with timer */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-secondary-900">{quiz.title}</h1>
            <span className="text-sm text-secondary-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
            
            <div className="text-sm text-secondary-600">
              {getAnsweredCount()}/{questions.length} answered
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200 sticky top-6">
            <h3 className="font-semibold text-secondary-900 mb-3">Question Navigation</h3>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id);
                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors duration-200 ${
                      index === currentQuestionIndex
                        ? 'ring-2 ring-primary-600 ring-offset-2'
                        : ''
                    } ${getStatusColor(status)}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-200 rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-secondary-900 mb-2">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-secondary-700 text-base leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>
              
              <button
                onClick={() => handleFlagQuestion(currentQuestion.id)}
                className={`ml-4 p-2 rounded-lg transition-colors duration-200 ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
                title={flaggedQuestions.has(currentQuestion.id) ? 'Unflag question' : 'Flag for review'}
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="text-primary-600 focus:ring-primary-500 mr-3"
                  />
                  <span className="text-secondary-900">{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    // Save current answer
                    toast.success('Progress saved');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-900"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={() => handleSubmitQuiz()}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Quiz</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-900"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;