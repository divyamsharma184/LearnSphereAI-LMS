# 🤖 AI-Powered Features for LearnSphere LMS

This document describes the AI features integrated into LearnSphere Learning Management System using LangChain and OpenAI.

## 🌟 Features Overview

### 1. AI Tutor (Q&A Assistant)
- **Natural Language Questions**: Students can ask questions in plain English
- **Context-Aware Answers**: AI provides answers based on uploaded course materials
- **Document Processing**: Supports PDF, DOCX, TXT, and HTML files
- **Vector Search**: Uses FAISS for efficient document retrieval
- **Real-time Chat**: Interactive chatbot interface

### 2. AI Quiz Generator
- **Automated Question Creation**: Generates questions from course content
- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Difficulty Levels**: Easy, medium, hard
- **Customizable Settings**: Number of questions, time limits, attempts
- **Smart Question Generation**: Creates questions that test understanding

## 🛠️ Technical Implementation

### Backend Architecture
```
server/
├── services/
│   ├── aiService.js          # LangChain integration & AI logic
│   └── documentService.js    # Document processing & text extraction
├── controllers/
│   └── aiController.js       # API endpoints for AI features
├── routes/
│   └── aiRoutes.js          # AI API routes
└── models/
    ├── course.js            # Enhanced with AI document fields
    └── quizModel.js         # Enhanced with AI generation data
```

### Frontend Components
```
client/src/components/AI/
├── AITutor.jsx              # Chatbot interface
├── AIQuizGenerator.jsx      # Quiz generation interface
└── AIIntegration.jsx        # Main AI features component
```

## 🚀 Quick Start

### 1. Installation
```bash
# Run the installation script
./install-ai.sh

# Or manually install dependencies
cd server
npm install
```

### 2. Environment Setup
Create `server/.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
MONGO_URI=mongodb://localhost/learningsphere
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start the Application
```bash
# Start server
cd server && npm run dev

# Start client (in another terminal)
cd client && npm run dev
```

## 📖 Usage Guide

### For Instructors

#### Setting Up AI Features
1. Navigate to your course detail page
2. Click on the "AI Features" tab
3. Upload course materials (PDFs, documents, notes)
4. Wait for AI processing to complete

#### Generating Quizzes
1. In the AI Features tab, click "Generate Quiz"
2. Configure quiz settings:
   - Number of questions (1-20)
   - Difficulty level (Easy/Medium/Hard)
   - Question type (Mixed/Multiple Choice/True-False/Short Answer)
   - Time limit and max attempts
3. Click "Generate Questions"
4. Review and edit generated questions
5. Add quiz title and description
6. Click "Save Quiz"

### For Students

#### Using AI Tutor
1. Navigate to course detail page
2. Click on the "AI Features" tab
3. Click "Start Chat" to open AI Tutor
4. Ask questions about course content:
   - "Explain Newton's 3rd law with examples"
   - "What are the key concepts in chapter 3?"
   - "How do I solve quadratic equations?"
5. Get instant, context-aware answers

## 🔧 API Reference

### AI Tutor Endpoints

#### Ask Question
```http
POST /api/ai/ask-question
Content-Type: application/json
Authorization: Bearer <token>

{
  "question": "Explain photosynthesis",
  "courseId": "course_id_here"
}
```

#### Get Chat History
```http
GET /api/ai/chat-history/:courseId
Authorization: Bearer <token>
```

#### Get AI Status
```http
GET /api/ai/status/:courseId
Authorization: Bearer <token>
```

### Document Upload

#### Upload Documents
```http
POST /api/ai/upload-documents/:courseId
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- documents: [file1, file2, ...]
```

### Quiz Generation

#### Generate Quiz Questions
```http
POST /api/ai/generate-quiz/:courseId
Content-Type: application/json
Authorization: Bearer <token>

{
  "numQuestions": 5,
  "difficulty": "medium",
  "questionType": "mixed"
}
```

#### Save Generated Quiz
```http
POST /api/ai/save-quiz/:courseId
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Chapter 3 Quiz",
  "description": "Quiz on photosynthesis",
  "questions": [...],
  "timeLimit": 30,
  "maxAttempts": 3
}
```

## 🎯 Example Use Cases

### AI Tutor Examples

**Student Questions:**
- "What is the difference between mitosis and meiosis?"
- "Can you explain the water cycle with a diagram?"
- "How do I calculate the area of a triangle?"
- "What are the main themes in Romeo and Juliet?"

**AI Responses:**
- Provides detailed explanations with examples
- References specific course materials
- Suggests additional resources when needed
- Maintains context across conversation

### Quiz Generation Examples

**Input:** Course materials on "Introduction to Biology"
**Generated Questions:**
- Multiple Choice: "What is the basic unit of life?"
- True/False: "All living things are made of cells."
- Short Answer: "Explain the process of cellular respiration."

## 🔒 Security & Privacy

### Data Protection
- All file uploads are validated for type and size
- Documents are processed locally before sending to OpenAI
- User authentication required for all AI operations
- Course access verification before AI features

### Content Filtering
- AI responses are filtered for inappropriate content
- File uploads are scanned for malicious content
- Rate limiting on API endpoints
- Secure handling of API keys

## 📊 Performance Optimization

### Document Processing
- Chunk size: 1000 characters with 200 character overlap
- Maximum file size: 10MB per file
- Supported formats: PDF, DOCX, DOC, TXT, HTML
- Automatic text cleaning and normalization

### Vector Search
- FAISS vector store for fast similarity search
- Embeddings cached for performance
- Batch processing for multiple documents
- Efficient memory usage

## 🐛 Troubleshooting

### Common Issues

#### "AI Not Available" Error
- **Cause**: No documents uploaded or OpenAI API key missing
- **Solution**: Upload course materials and verify API key

#### File Upload Fails
- **Cause**: File too large or unsupported format
- **Solution**: Check file size (<10MB) and format (PDF, DOCX, TXT, HTML)

#### Slow AI Responses
- **Cause**: Large documents or network issues
- **Solution**: Reduce document size or check internet connection

#### Quiz Generation Errors
- **Cause**: Insufficient course content or API limits
- **Solution**: Add more course materials or check OpenAI usage

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 🔮 Future Enhancements

### Planned Features
- [ ] **Voice-to-Text**: Ask questions using voice
- [ ] **Multi-language Support**: AI responses in multiple languages
- [ ] **Advanced Analytics**: Track AI usage and effectiveness
- [ ] **Custom AI Models**: Fine-tune models for specific subjects
- [ ] **Real-time Collaboration**: Multiple students in AI chat
- [ ] **Integration with External APIs**: Wikipedia, Wolfram Alpha, etc.

### Advanced AI Features
- [ ] **Personalized Learning Paths**: AI-generated study plans
- [ ] **Automated Grading**: AI assessment of open-ended questions
- [ ] **Content Recommendations**: Suggest additional learning materials
- [ ] **Predictive Analytics**: Identify at-risk students
- [ ] **Natural Language Processing**: Advanced text analysis

## 📞 Support

### Getting Help
1. Check the troubleshooting section above
2. Review the setup guide in `server/setup-ai.md`
3. Check OpenAI API documentation
4. Verify your API key and credits

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This AI integration is part of the LearnSphere LMS project. Please refer to the main project license for usage terms.

---

**🎉 Congratulations!** Your LearnSphere LMS now has cutting-edge AI features that will enhance the learning experience for both students and instructors.
