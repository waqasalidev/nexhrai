import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
import Resume from '../models/Resume.js';
import AIHistory from '../models/AIHistory.js';
import {
  analyzeAndOptimizeResume,
  generateCoverLetter,
  generateQuestions,
  provideCareerAdvice,
  generateJobDescriptionText,
  checkATSAndMatchJob
} from '../services/geminiService.js';

// Robust helper to parse PDF text across multiple environment configurations
const parsePDF = async (dataBuffer) => {
  if (typeof pdfParseModule === 'function') {
    const res = await pdfParseModule(dataBuffer);
    return res.text;
  }
  if (pdfParseModule && typeof pdfParseModule.PDFParse === 'function') {
    const uint8Array = new Uint8Array(dataBuffer);
    const parser = new pdfParseModule.PDFParse(uint8Array);
    await parser.load(uint8Array);
    const result = await parser.getText();
    parser.destroy();
    return result && typeof result === 'object' ? result.text : result;
  }
  throw new Error('Unsupported PDF parser export format');
};

// Helper to extract text from file or body
const extractResumeText = async (req) => {
  let text = '';

  if (req.file) {
    const dataBuffer = fs.readFileSync(req.file.path);
    text = await parsePDF(dataBuffer);
  } else if (req.body.resumeText) {
    text = req.body.resumeText;
  } else {
    // Try to find last saved resume of user
    const savedResume = await Resume.findOne({ candidate: req.user._id }).sort({ createdAt: -1 });
    if (savedResume && savedResume.extractedText) {
      text = savedResume.extractedText;
    }
  }

  if (!text || text.trim().length < 20) {
    throw new Error('Could not extract readable text from the resume. Please ensure the uploaded PDF contains readable text (not scanned/empty) or provide your resume details manually.');
  }

  return text.trim();
};

// Log token history helper
const logAIServiceUse = async (userId, action, textLength) => {
  await AIHistory.create({
    user: userId,
    action: action,
    promptTokens: Math.round(textLength / 4),
    completionTokens: 200,
    totalTokens: Math.round(textLength / 4) + 200,
  });
};

// @desc    Analyze and optimize resume
// @route   POST /api/ai/analyze-resume
// @access  Private
export const analyzeResumeOnly = async (req, res) => {
  try {
    const resumeText = await extractResumeText(req);
    const analysis = await analyzeAndOptimizeResume(resumeText);
    
    await logAIServiceUse(req.user._id, 'Resume Analyzer', resumeText.length);

    // Save resume to DB if uploaded as file
    if (req.file) {
      await Resume.create({
        candidate: req.user._id,
        filePath: req.file.path.replace(/\\/g, '/'),
        fileName: req.file.originalname,
        extractedText: resumeText,
        aiAnalysis: {
          summary: analysis.summary,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          suggestions: analysis.suggestions,
          optimizedKeywords: analysis.optimizedKeywords,
        },
        atsScore: analysis.atsScore,
        personalInfo: analysis.personalInfo || {},
        skills: analysis.skills || [],
        experience: analysis.experience || '',
        education: analysis.education || '',
        projects: analysis.projects || [],
        certifications: analysis.certifications || [],
        languages: analysis.languages || [],
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error(`AI resume analyze error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate Cover Letter
// @route   POST /api/ai/generate-cover-letter
// @access  Private
export const generateCoverLetterOnly = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Please provide jobDescription' });
    }

    const resumeText = await extractResumeText(req);
    const coverLetter = await generateCoverLetter(resumeText, jobDescription);
    
    await logAIServiceUse(req.user._id, 'Cover Letter Generator', resumeText.length + jobDescription.length);

    res.json({ coverLetter });
  } catch (error) {
    console.error(`AI cover letter error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate Interview Preparation Questions
// @route   POST /api/ai/interview-prep
// @access  Private
export const generateInterviewPrep = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Please provide jobDescription' });
    }

    const resumeText = await extractResumeText(req);
    const prepData = await generateQuestions(resumeText, jobDescription);
    
    await logAIServiceUse(req.user._id, 'Interview Questions Generator', resumeText.length + jobDescription.length);

    res.json(prepData);
  } catch (error) {
    console.error(`AI interview prep error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Provide Career Advice
// @route   POST /api/ai/career-advice
// @access  Private
export const getCareerAdvice = async (req, res) => {
  try {
    const { careerGoals } = req.body;
    const resumeText = await extractResumeText(req);
    
    const advice = await provideCareerAdvice(resumeText, careerGoals);
    
    await logAIServiceUse(req.user._id, 'Career Advisor', resumeText.length);

    res.json({ advice });
  } catch (error) {
    console.error(`AI career advice error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Check ATS Score & Job Matching
// @route   POST /api/ai/check-ats
// @access  Private
export const checkATSScore = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Please provide jobDescription' });
    }

    const resumeText = await extractResumeText(req);
    const result = await checkATSAndMatchJob(resumeText, jobDescription);
    
    await logAIServiceUse(req.user._id, 'ATS Checker', resumeText.length + jobDescription.length);

    res.json(result);
  } catch (error) {
    console.error(`AI ATS check error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate Job Description
// @route   POST /api/ai/generate-job-description
// @access  Private/Recruiter/Admin
export const generateJobDescription = async (req, res) => {
  try {
    const { title, keyRequirements } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Please provide a job title' });
    }
    const data = await generateJobDescriptionText(title, keyRequirements);
    
    // Append salary range and candidate availability insights directly to the text body
    if (data.salaryRange || data.candidateAvailability) {
      data.description = `${data.description}\n\nAI Suggested Salary Range: ${data.salaryRange || 'N/A'}\nAI Estimated Market Availability: ${data.candidateAvailability || 'N/A'}`;
    }

    await logAIServiceUse(req.user._id, 'Job Description Generator', title.length + (keyRequirements?.length || 0));

    res.json(data);
  } catch (error) {
    console.error(`AI job description generation error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};
