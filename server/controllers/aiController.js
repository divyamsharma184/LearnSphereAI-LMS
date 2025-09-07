const aiService = require('../services/aiService');
const documentService = require('../services/documentService');
const Course = require('../models/course');
const Quiz = require('../models/quizModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.html'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, TXT, and HTML files are allowed.'));
    }
  }
});

// AI Tutor - Answer student questions
exports.askQuestion = async (req, res) => {
  try {
    const { question, courseId } = req.body;
    const userId = req.user.id;

    if (!question || !courseId) {
      return res.status(400).json({ 
        error: 'Question and courseId are required' 
      });
    }

    // Verify user is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled (for students) or is instructor
    const isEnrolled = course.enrolledStudents.includes(userId);
    const isInstructor = course.instructorId.toString() === userId;
    
    if (!isEnrolled && !isInstructor) {
      return res.status(403).json({ 
        error: 'You must be enrolled in this course to ask questions' 
      });
    }

    // Get AI answer
    const answer = await aiService.answerQuestion(question, courseId);

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: answer.answer,
        sources: answer.sources,
        timestamp: answer.timestamp,
        courseId,
        askedBy: userId,
      }
    });
  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      details: error.message 
    });
  }
};

// Upload course documents for AI processing
exports.uploadDocuments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verify user is instructor of the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId.toString() !== userId) {
      return res.status(403).json({ 
        error: 'Only the course instructor can upload documents' 
      });
    }

    // Process uploaded files
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const processedDocuments = [];
    
    for (const file of files) {
      try {
        const result = await documentService.processFile(file.path, file.originalname);
        processedDocuments.push(result);
        
        // Clean up uploaded file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error(`❌ Error processing file ${file.originalname}:`, error);
        // Clean up file even if processing failed
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    if (processedDocuments.length === 0) {
      return res.status(400).json({ 
        error: 'No documents could be processed' 
      });
    }

    // Initialize AI service for this course
    await aiService.initializeVectorStore(courseId);
    
    // Process documents and store in vector database
    const documentTexts = processedDocuments.map(doc => doc.text);
    const chunkCount = await aiService.processDocuments(courseId, documentTexts);

    // Update course with document information
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        aiDocuments: {
          $each: processedDocuments.map(doc => ({
            fileName: doc.fileName,
            fileType: doc.fileType,
            wordCount: doc.wordCount,
            processedAt: doc.processedAt,
          }))
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Documents uploaded and processed successfully',
      data: {
        processedCount: processedDocuments.length,
        chunkCount,
        documents: processedDocuments.map(doc => ({
          fileName: doc.fileName,
          fileType: doc.fileType,
          wordCount: doc.wordCount,
        }))
      }
    });
  } catch (error) {
    console.error('❌ Error in uploadDocuments:', error);
    res.status(500).json({ 
      error: 'Failed to upload documents',
      details: error.message 
    });
  }
};

// Generate quiz questions from course content
exports.generateQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { numQuestions = 5, difficulty = 'medium', questionType = 'mixed' } = req.body;
    const userId = req.user.id;

    // Verify user is instructor of the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId.toString() !== userId) {
      return res.status(403).json({ 
        error: 'Only the course instructor can generate quizzes' 
      });
    }

    // Check if course has AI documents
    if (!course.aiDocuments || course.aiDocuments.length === 0) {
      return res.status(400).json({ 
        error: 'No documents available for quiz generation. Please upload course materials first.' 
      });
    }

    // Get course content from vector store
    await aiService.initializeVectorStore(courseId);
    
    // For now, we'll use a sample of course content
    // In a real implementation, you'd retrieve the actual content from the vector store
    const courseContent = course.description + ' ' + (course.syllabus || '') + ' ' + (course.objectives || '');

    // Generate quiz questions
    const questions = await aiService.generateQuestionVariations(courseContent, questionType);

    // Limit to requested number of questions
    const selectedQuestions = questions.slice(0, numQuestions);

    res.status(200).json({
      success: true,
      data: {
        questions: selectedQuestions,
        totalGenerated: questions.length,
        requested: numQuestions,
        difficulty,
        questionType,
      }
    });
  } catch (error) {
    console.error('❌ Error in generateQuiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz questions',
      details: error.message 
    });
  }
};

// Save generated quiz to database
exports.saveGeneratedQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, questions, timeLimit, maxAttempts, dueDate } = req.body;
    const userId = req.user.id;

    // Verify user is instructor of the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId.toString() !== userId) {
      return res.status(403).json({ 
        error: 'Only the course instructor can save quizzes' 
      });
    }

    // Create quiz object
    const quizData = {
      title,
      description,
      courseId,
      timeLimit: timeLimit || 30,
      maxAttempts: maxAttempts || 3,
      dueDate: dueDate ? new Date(dueDate) : null,
      questions: questions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points || 1,
        explanation: q.explanation || '',
      })),
      createdBy: userId,
      isAIGenerated: true,
    };

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz saved successfully',
      data: {
        quizId: quiz._id,
        title: quiz.title,
        questionCount: quiz.questions.length,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
      }
    });
  } catch (error) {
    console.error('❌ Error in saveGeneratedQuiz:', error);
    res.status(500).json({ 
      error: 'Failed to save quiz',
      details: error.message 
    });
  }
};

// Get AI chat history for a course
exports.getChatHistory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verify user has access to the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.includes(userId);
    const isInstructor = course.instructorId.toString() === userId;
    
    if (!isEnrolled && !isInstructor) {
      return res.status(403).json({ 
        error: 'You must be enrolled in this course to view chat history' 
      });
    }

    // In a real implementation, you'd retrieve chat history from database
    // For now, return empty array
    res.status(200).json({
      success: true,
      data: {
        chatHistory: [],
        courseId,
        userId,
      }
    });
  } catch (error) {
    console.error('❌ Error in getChatHistory:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve chat history',
      details: error.message 
    });
  }
};

// Get course AI status
exports.getCourseAIStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.includes(userId);
    const isInstructor = course.instructorId.toString() === userId;
    
    if (!isEnrolled && !isInstructor) {
      return res.status(403).json({ 
        error: 'You must be enrolled in this course to view AI status' 
      });
    }

    const aiStatus = {
      hasDocuments: course.aiDocuments && course.aiDocuments.length > 0,
      documentCount: course.aiDocuments ? course.aiDocuments.length : 0,
      totalWordCount: course.aiDocuments ? 
        course.aiDocuments.reduce((sum, doc) => sum + doc.wordCount, 0) : 0,
      lastUpdated: course.aiDocuments && course.aiDocuments.length > 0 ?
        course.aiDocuments[course.aiDocuments.length - 1].processedAt : null,
      aiEnabled: course.aiDocuments && course.aiDocuments.length > 0,
    };

    res.status(200).json({
      success: true,
      data: aiStatus
    });
  } catch (error) {
    console.error('❌ Error in getCourseAIStatus:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve AI status',
      details: error.message 
    });
  }
};

// Export multer middleware for use in routes
exports.uploadMiddleware = upload.array('documents', 10); // Max 10 files
