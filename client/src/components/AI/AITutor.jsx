import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  BookOpen,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AITutor = ({ courseId, isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadAIStatus();
      loadChatHistory();
    }
  }, [isOpen, courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/ai/chat-history/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.chatHistory || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question: inputMessage,
          courseId: courseId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.data.answer,
          sources: data.data.sources,
          timestamp: data.data.timestamp,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('documents', file);
    });

    try {
      const response = await fetch(`/api/ai/upload-documents/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully uploaded ${data.data.processedCount} documents`);
        loadAIStatus();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload documents');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload documents');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bot className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">AI Tutor</h2>
              <p className="text-sm text-secondary-600">Ask questions about course content</p>
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
              
              {(user?.role === 'instructor' || user?.role === 'admin') && (
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="document-upload"
                    multiple
                    accept=".pdf,.docx,.doc,.txt,.html"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="document-upload"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isUploading
                        ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{isUploading ? 'Uploading...' : 'Upload Docs'}</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Start a conversation with AI Tutor
              </h3>
              <p className="text-secondary-600 mb-4">
                Ask questions about course content, concepts, or get explanations.
              </p>
              {!aiStatus?.aiEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      AI Tutor is not available. Course materials need to be uploaded first.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' && (
                      <Bot className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-secondary-200">
                          <p className="text-xs text-secondary-600 mb-2">Sources:</p>
                          <div className="space-y-1">
                            {message.sources.slice(0, 3).map((source, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-secondary-500" />
                                <span className="text-xs text-secondary-600">
                                  {source.metadata?.fileName || `Source ${index + 1}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary-100 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-primary-600" />
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                    <span className="text-sm text-secondary-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-secondary-200">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                aiStatus?.aiEnabled 
                  ? "Ask a question about the course content..."
                  : "AI Tutor is not available. Upload course materials first."
              }
              disabled={!aiStatus?.aiEnabled || isLoading}
              className="flex-1 input-field"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || !aiStatus?.aiEnabled || isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
