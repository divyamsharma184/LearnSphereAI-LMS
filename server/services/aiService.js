require('dotenv').config();
const { OpenAI } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { PromptTemplate } = require('@langchain/core/prompts');
const fs = require('fs');
const path = require('path');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });
    
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    
    this.vectorStore = null;
    this.qaChain = null;
  }

  // Initialize vector store with course documents
  async initializeVectorStore(courseId) {
    try {
      const vectorStorePath = path.join(__dirname, `../vectorstores/course_${courseId}`);
      
      // Check if vector store already exists
      if (fs.existsSync(vectorStorePath)) {
        this.vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);
        console.log(`✅ Loaded existing vector store for course ${courseId}`);
      } else {
        // Create new vector store
        this.vectorStore = new FaissStore(this.embeddings, {});
        console.log(`✅ Created new vector store for course ${courseId}`);
      }
      
      return this.vectorStore;
    } catch (error) {
      console.error('❌ Error initializing vector store:', error);
      throw error;
    }
  }

  // Process and store documents in vector database
  async processDocuments(courseId, documents) {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const texts = await textSplitter.splitText(documents.join('\n\n'));
      
      // Add documents to vector store
      await this.vectorStore.addDocuments(
        texts.map(text => ({ pageContent: text, metadata: { courseId } }))
      );

      // Save vector store
      const vectorStorePath = path.join(__dirname, `../vectorstores/course_${courseId}`);
      await this.vectorStore.save(vectorStorePath);
      
      console.log(`✅ Processed ${texts.length} document chunks for course ${courseId}`);
      return texts.length;
    } catch (error) {
      console.error('❌ Error processing documents:', error);
      throw error;
    }
  }

  // Create QA chain for answering questions
  async createQAChain() {
    try {
      const promptTemplate = new PromptTemplate({
        template: `You are an AI tutor for a learning management system. Answer the student's question based on the provided context from course materials. Be helpful, accurate, and educational.

Context: {context}

Question: {question}

Answer: Provide a clear, comprehensive answer. If the context doesn't contain enough information, say so and suggest where the student might find more information.`,
        inputVariables: ['context', 'question'],
      });

      this.qaChain = RetrievalQAChain.fromLLM(
        this.openai,
        this.vectorStore.asRetriever({ k: 4 }),
        { prompt: promptTemplate }
      );

      return this.qaChain;
    } catch (error) {
      console.error('❌ Error creating QA chain:', error);
      throw error;
    }
  }

  // Answer student questions
  async answerQuestion(question, courseId) {
    try {
      if (!this.vectorStore) {
        await this.initializeVectorStore(courseId);
      }
      
      if (!this.qaChain) {
        await this.createQAChain();
      }

      const result = await this.qaChain.call({ query: question });
      
      return {
        answer: result.text,
        sources: result.sourceDocuments || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error answering question:', error);
      throw error;
    }
  }

  // Generate quiz questions from course content
  async generateQuizQuestions(courseContent, numQuestions = 5, difficulty = 'medium') {
    try {
      const prompt = `Generate ${numQuestions} quiz questions based on the following course content. 
      Difficulty level: ${difficulty}
      
      Course Content:
      ${courseContent}
      
      Generate questions in the following JSON format:
      {
        "questions": [
          {
            "question": "Question text here",
            "type": "multiple-choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B",
            "explanation": "Explanation of why this is correct",
            "difficulty": "${difficulty}",
            "points": 1
          }
        ]
      }
      
      Rules:
      - Mix question types: multiple-choice, true-false, short-answer
      - Ensure questions test understanding, not just memorization
      - Make options plausible for multiple-choice questions
      - Provide clear explanations
      - Base questions directly on the provided content`;

      const response = await this.openai.call(prompt);
      const quizData = JSON.parse(response);
      
      return quizData.questions;
    } catch (error) {
      console.error('❌ Error generating quiz questions:', error);
      throw error;
    }
  }

  // Generate different types of questions
  async generateQuestionVariations(courseContent, questionType = 'mixed') {
    try {
      const variations = {
        multipleChoice: await this.generateQuizQuestions(courseContent, 3, 'medium'),
        trueFalse: await this.generateTrueFalseQuestions(courseContent, 2),
        shortAnswer: await this.generateShortAnswerQuestions(courseContent, 2),
      };

      if (questionType === 'mixed') {
        return [
          ...variations.multipleChoice,
          ...variations.trueFalse,
          ...variations.shortAnswer,
        ];
      }

      return variations[questionType] || variations.multipleChoice;
    } catch (error) {
      console.error('❌ Error generating question variations:', error);
      throw error;
    }
  }

  // Generate true/false questions
  async generateTrueFalseQuestions(courseContent, numQuestions = 2) {
    try {
      const prompt = `Generate ${numQuestions} true/false questions based on the following course content:
      
      ${courseContent}
      
      Return in JSON format:
      {
        "questions": [
          {
            "question": "Statement here",
            "type": "true-false",
            "correctAnswer": true,
            "explanation": "Explanation here",
            "difficulty": "medium",
            "points": 1
          }
        ]
      }`;

      const response = await this.openai.call(prompt);
      return JSON.parse(response).questions;
    } catch (error) {
      console.error('❌ Error generating true/false questions:', error);
      throw error;
    }
  }

  // Generate short answer questions
  async generateShortAnswerQuestions(courseContent, numQuestions = 2) {
    try {
      const prompt = `Generate ${numQuestions} short answer questions based on the following course content:
      
      ${courseContent}
      
      Return in JSON format:
      {
        "questions": [
          {
            "question": "Question here",
            "type": "short-answer",
            "correctAnswer": "Expected answer",
            "explanation": "Explanation here",
            "difficulty": "medium",
            "points": 2
          }
        ]
      }`;

      const response = await this.openai.call(prompt);
      return JSON.parse(response).questions;
    } catch (error) {
      console.error('❌ Error generating short answer questions:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
