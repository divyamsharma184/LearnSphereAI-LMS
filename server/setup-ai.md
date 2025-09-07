# AI Integration Setup Guide

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Node.js**: Version 16 or higher
3. **MongoDB**: Running locally or MongoDB Atlas

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost/learningsphere

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Create Required Directories

```bash
mkdir -p server/uploads/courses
mkdir -p server/vectorstores
```

### 4. Start the Server

```bash
npm run dev
```

## Features Added

### 🤖 AI Tutor
- **Q&A Assistant**: Students can ask questions about course content
- **Document Processing**: Supports PDF, DOCX, TXT, HTML files
- **Vector Search**: Uses FAISS for efficient document retrieval
- **Context-Aware Answers**: Provides relevant answers based on course materials

### 📝 AI Quiz Generator
- **Automated Question Generation**: Creates questions from course content
- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Difficulty Levels**: Easy, medium, hard
- **Customizable Settings**: Number of questions, time limits, attempts

## API Endpoints

### AI Tutor
- `POST /api/ai/ask-question` - Ask questions to AI tutor
- `GET /api/ai/chat-history/:courseId` - Get chat history
- `GET /api/ai/status/:courseId` - Get AI status for course

### Document Upload
- `POST /api/ai/upload-documents/:courseId` - Upload course documents

### Quiz Generation
- `POST /api/ai/generate-quiz/:courseId` - Generate quiz questions
- `POST /api/ai/save-quiz/:courseId` - Save generated quiz

## Usage

### For Instructors:
1. Go to course detail page
2. Click on "AI Features" tab
3. Upload course materials (PDFs, documents, notes)
4. Use AI Quiz Generator to create quizzes
5. Students can then use AI Tutor for questions

### For Students:
1. Go to course detail page
2. Click on "AI Features" tab
3. Use AI Tutor to ask questions about course content
4. Get instant, context-aware answers

## File Structure

```
server/
├── services/
│   ├── aiService.js          # AI service with LangChain integration
│   └── documentService.js    # Document processing service
├── controllers/
│   └── aiController.js       # AI API controllers
├── routes/
│   └── aiRoutes.js          # AI API routes
├── models/
│   ├── course.js            # Updated with AI fields
│   └── quizModel.js         # Updated with AI fields
└── uploads/
    └── courses/             # Temporary file uploads
```

## Troubleshooting

### Common Issues:

1. **OpenAI API Key Error**: Make sure your API key is valid and has sufficient credits
2. **File Upload Issues**: Check file permissions and disk space
3. **Vector Store Errors**: Ensure the vectorstores directory exists and is writable
4. **Memory Issues**: Large documents may require more memory; consider chunking

### Performance Tips:

1. **Document Size**: Keep individual documents under 10MB
2. **Chunk Size**: Adjust chunk size in aiService.js for better performance
3. **Vector Store**: Consider using MongoDB Atlas Vector Search for production
4. **Caching**: Implement Redis for caching frequent queries

## Security Notes

- File uploads are validated for type and size
- AI responses are filtered for inappropriate content
- User authentication is required for all AI features
- Course access is verified before AI operations

## Future Enhancements

- [ ] Real-time chat with WebSocket
- [ ] Voice-to-text for questions
- [ ] Multi-language support
- [ ] Advanced analytics for AI usage
- [ ] Integration with external knowledge bases
- [ ] Custom AI model fine-tuning
