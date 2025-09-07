const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');

class DocumentService {
  constructor() {
    this.supportedFormats = ['.pdf', '.docx', '.doc', '.txt', '.html'];
  }

  // Process uploaded file and extract text
  async processFile(filePath, originalName) {
    try {
      const extension = path.extname(originalName).toLowerCase();
      
      if (!this.supportedFormats.includes(extension)) {
        throw new Error(`Unsupported file format: ${extension}`);
      }

      let text = '';
      
      switch (extension) {
        case '.pdf':
          text = await this.extractFromPDF(filePath);
          break;
        case '.docx':
        case '.doc':
          text = await this.extractFromWord(filePath);
          break;
        case '.txt':
          text = await this.extractFromText(filePath);
          break;
        case '.html':
          text = await this.extractFromHTML(filePath);
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      return {
        text: this.cleanText(text),
        wordCount: this.getWordCount(text),
        fileName: originalName,
        fileType: extension,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error processing file:', error);
      throw error;
    }
  }

  // Extract text from PDF
  async extractFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('❌ Error extracting PDF:', error);
      throw error;
    }
  }

  // Extract text from Word document
  async extractFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('❌ Error extracting Word document:', error);
      throw error;
    }
  }

  // Extract text from plain text file
  async extractFromText(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('❌ Error extracting text file:', error);
      throw error;
    }
  }

  // Extract text from HTML file
  async extractFromHTML(filePath) {
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(html);
      
      // Remove script and style elements
      $('script, style').remove();
      
      // Get text content
      return $.text();
    } catch (error) {
      console.error('❌ Error extracting HTML:', error);
      throw error;
    }
  }

  // Clean and normalize text
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
      .trim();
  }

  // Get word count
  getWordCount(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Process multiple files
  async processMultipleFiles(files) {
    try {
      const results = [];
      
      for (const file of files) {
        const result = await this.processFile(file.path, file.originalname);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      console.error('❌ Error processing multiple files:', error);
      throw error;
    }
  }

  // Extract key topics from text
  extractTopics(text) {
    // Simple topic extraction - can be enhanced with NLP
    const sentences = text.split(/[.!?]+/);
    const topics = [];
    
    // Extract sentences that might contain key concepts
    sentences.forEach(sentence => {
      if (sentence.length > 20 && sentence.length < 200) {
        // Look for definition patterns
        if (sentence.toLowerCase().includes('is defined as') || 
            sentence.toLowerCase().includes('refers to') ||
            sentence.toLowerCase().includes('means')) {
          topics.push(sentence.trim());
        }
      }
    });
    
    return topics.slice(0, 10); // Return top 10 topics
  }

  // Generate summary of document
  async generateSummary(text, maxLength = 500) {
    try {
      // Simple extractive summary - can be enhanced with AI
      const sentences = text.split(/[.!?]+/);
      const importantSentences = sentences
        .filter(sentence => sentence.length > 30 && sentence.length < 200)
        .slice(0, 5);
      
      return importantSentences.join('. ') + '.';
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      throw error;
    }
  }
}

module.exports = new DocumentService();
