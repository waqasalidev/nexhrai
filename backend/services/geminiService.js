import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAIClient = () => {
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return null;
};

// Generic caller with JSON mode constraint
const callGeminiJSON = async (prompt, systemInstruction = "") => {
  const genAI = getGenAIClient();
  if (!genAI) {
    console.warn("[GEMINI WARNING] GEMINI_API_KEY is not defined. Using mock fallback data.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error(`Gemini API Error: ${error.message}`);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

// Generic text caller for freeform responses
const callGeminiText = async (prompt, systemInstruction = "") => {
  const genAI = getGenAIClient();
  if (!genAI) {
    console.warn("[GEMINI WARNING] GEMINI_API_KEY is not defined. Using mock fallback data.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Gemini API Error: ${error.message}`);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

/**
 * 1. Resume Analyzer & 3. Resume Optimizer
 */
export const analyzeAndOptimizeResume = async (resumeText) => {
  const prompt = `
    Analyze the following resume text. Output a JSON object containing:
    {
      "summary": "a short summary of the candidate's background and experience",
      "strengths": ["list of 3-5 strengths"],
      "weaknesses": ["list of 2-4 areas of improvement"],
      "suggestions": ["list of 3-5 action items to optimize the resume"],
      "optimizedKeywords": ["keywords/skills that should be added or emphasized"],
      "atsScore": 85,
      "personalInfo": {
        "name": "extracted full name or empty string",
        "email": "extracted email address or empty string",
        "phone": "extracted phone number or empty string",
        "linkedin": "extracted LinkedIn URL or empty string",
        "github": "extracted GitHub URL or empty string",
        "portfolio": "extracted portfolio URL or empty string"
      },
      "skills": ["list of extracted skills"],
      "experience": "extracted experience overview or years of experience",
      "education": "extracted highest education details",
      "projects": ["list of projects"],
      "certifications": ["list of certifications"],
      "languages": ["list of languages"]
    }
    Resume Text:
    """
    ${resumeText}
    """
  `;
  
  const fallback = {
    summary: "Candidate Profile: Senior engineer with extensive experience in React, JavaScript, and Node.js development.",
    strengths: ["Strong technical core in React and frontend architecture", "Experience with state management", "Good styling practices"],
    weaknesses: ["Missing cloud deployment metrics", "Could show more leadership metrics"],
    suggestions: ["Quantify achievements (e.g. increase performance by X%)", "Add more keywords related to cloud systems"],
    optimizedKeywords: ["AWS", "Docker", "CI/CD Pipelines", "System Design"],
    atsScore: 78,
    personalInfo: {
      name: "Waqas Ali",
      email: "iwaqasaliii@gmail.com",
      phone: "03284744253",
      linkedin: "linkedin.com/in/waqas-aliii",
      github: "github.com/waqasalidev",
      portfolio: "waqasalii-portfolio.vercel.app"
    },
    skills: ["ReactJS", "NodeJS", "ExpressJS", "MongoDB", "Tailwind CSS", "JavaScript"],
    experience: "3+ years of web development experience building MERN apps and freelancing.",
    education: "Bachelors of Computer Science, Lahore Leads University",
    projects: ["NexKind - AI Career Guidance", "NexStore - 3D E-Commerce Platform"],
    certifications: ["Web Developer Certificate"],
    languages: ["English", "Urdu"]
  };

  const res = await callGeminiJSON(prompt, "You are a professional HR resume auditor.");
  return res || fallback;
};

/**
 * 2. ATS Score Checker & 4. Job Match Analysis & 5. Skill Gap Analysis
 */
export const checkATSAndMatchJob = async (resumeText, jobDescription) => {
  const prompt = `
    Compare the candidate resume text against the job description and perform a strict compliance audit.
    
    You MUST calculate the "atsScore" (0-100) and "matchPercentage" (0-100) using these strict evaluation weights:
    - Keywords & Skills Coverage (30% weight): Compare matching and missing technical and soft skills.
    - Experience Alignment (30% weight): Compare candidate experience level and years of experience with job requirements.
    - Education & Certifications Match (20% weight): Grade alignment of candidate's highest education and certifications.
    - Resume Structure & Formatting (10% weight): Audit section clarity, layout parsability, and data completeness (e.g. contact channels, links).
    - Action Verbs & Achievements (10% weight): Check for strong action verbs (e.g. designed, managed, accelerated) and quantifiable results.

    Output a JSON object with:
    {
      "atsScore": 75,
      "matchPercentage": 80,
      "fitSummary": "a short explanation of how well the candidate fits the job and why, referencing the audit findings",
      "skillMatch": ["skills matching the requirements"],
      "skillGaps": ["skills requested in the job description that are missing or weak in the resume"],
      "suggestions": ["actionable recommendations to match this job better (e.g., adding action verbs, adjusting layout structure, formatting gaps)"],
      "yearsOfExperience": "number of years or description",
      "experienceLevel": "e.g., Junior, Mid, Senior",
      "education": "highest level of education found",
      "certifications": ["list of certifications found"],
      "projects": ["list of relevant projects found"],
      "technicalSkills": ["list of technical skills found"],
      "softSkills": ["list of soft skills found"],
      "recommendation": "Highly Recommended" // Must be one of: Highly Recommended, Recommended, Average Match, Not Recommended
    }
    
    Resume Text:
    """
    ${resumeText}
    """

    Job Description:
    """
    ${jobDescription}
    """
  `;

  const fallback = {
    atsScore: 72,
    matchPercentage: 75,
    fitSummary: "The candidate has strong matching frontend expertise but lacks backend databases requested in the description.",
    skillMatch: ["React", "CSS", "TypeScript", "JavaScript"],
    skillGaps: ["MongoDB", "Express", "Node.js", "Redis"],
    suggestions: ["Add a projects section mentioning Node.js backend integration", "Highlight any experience with RESTful APIs"],
    yearsOfExperience: "3 years",
    experienceLevel: "Mid-level",
    education: "Bachelors in Computer Science",
    certifications: ["Web Developer Certificate"],
    projects: ["NexKind - AI Career Guidance Platform"],
    technicalSkills: ["ReactJS", "NodeJS", "ExpressJS", "MongoDB"],
    softSkills: ["Team Collaboration", "Problem Solving"],
    recommendation: "Recommended"
  };

  const res = await callGeminiJSON(prompt, "You are an ATS compliance auditor.");
  return res || fallback;
};

/**
 * 6. Interview Question Generator
 */
export const generateQuestions = async (resumeText, jobDescription) => {
  const prompt = `
    Based on the candidate resume and the job description, generate highly customized interview questions testing the candidate's experience and fit.
    You MUST include at least one of each of the following question categories:
    - Technical Question
    - HR Question
    - Coding Question
    - Follow-up Question (based on specific claims, projects or metrics in their resume)
    
    Output a JSON object with:
    {
      "questions": [
        {
          "question": "[Technical Question / HR Question / Coding Question / Follow-up Question] Specific question text...",
          "suggestedAnswer": "Actionable points outlining what a good response should include"
        }
      ]
    }

    Resume Text:
    """
    ${resumeText}
    """

    Job Description:
    """
    ${jobDescription}
    """
  `;

  const fallback = {
    questions: [
      {
        "question": "[Technical Question] Can you describe a complex React application you built and how you managed state?",
        "suggestedAnswer": "The candidate should mention Context API, Redux, or Zustand, discussing performance optimizations and state design."
      },
      {
        "question": "[Coding Question] Write a helper function in JavaScript that flattens a nested object structure into a single-level depth.",
        "suggestedAnswer": "Look for depth-first recursion, correct baseline checks for primitives, and avoidance of stack overflow."
      },
      {
        "question": "[HR Question] Tell me about a time you had a technical disagreement with a team member. How did you resolve it?",
        "suggestedAnswer": "Evaluate communication skills, empathy, respect, and logical engineering arguments based on metrics rather than ego."
      },
      {
        "question": "[Follow-up Question] In your resume, you mention building NexKind (AI Guidance Portal). What was the major bottleneck in connecting it to the AI service, and how did you resolve it?",
        "suggestedAnswer": "Assess depth of project involvement, engineering design, error handling, and knowledge of API concurrency."
      }
    ]
  };

  const res = await callGeminiJSON(prompt, "You are a senior technical interviewer hiring a team member.");
  return res || fallback;
};

/**
 * 7. Cover Letter Generator
 */
export const generateCoverLetter = async (resumeText, jobDescription) => {
  const prompt = `
    Write a professional, compelling cover letter for a candidate with the following resume applying for the job described.
    The response should be standard text ready to copy.
    
    Resume Text:
    """
    ${resumeText}
    """

    Job Description:
    """
    ${jobDescription}
    """
  `;

  const fallback = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the open position. With my background in software development and my proficiency in building high-performance web applications, I am confident I would be a great fit for your team.\n\nLooking forward to speaking with you.\n\nBest regards,\nCandidate`;

  const res = await callGeminiText(prompt, "You are a professional career writer.");
  return res || fallback;
};

/**
 * 8. Resume Summary & 9. Career Advisor
 */
export const provideCareerAdvice = async (resumeText, careerGoals = "") => {
  const prompt = `
    Provide professional career advice and structural tips for a candidate with the following resume.
    If the candidate specified goals, align with them.
    Goals: ${careerGoals || "General career progression and growth in software engineering."}
    
    Resume Text:
    """
    ${resumeText}
    """
  `;

  const fallback = `### Career Advice & Next Steps\n\n1. **Specialize in System Design**: Focus on learning scalable backend services.\n2. **Contribute to Open Source**: Share your React libraries on GitHub.\n3. **Learn Cloud Infrastructure**: Obtain AWS or GCP certifications.`;

  const res = await callGeminiText(prompt, "You are an executive career advisor.");
  return res || fallback;
};

/**
 * 10. Candidate Ranking
 */
export const rankCandidates = async (candidates, jobDescription) => {
  // candidates: [{ id, name, resumeText }]
  const candidatesData = candidates.map(c => `Candidate ID: ${c.id}, Name: ${c.name}\nResume:\n${c.resumeText}\n---`).join("\n");
  const prompt = `
    You are an expert recruiter. Compare the following candidates against the job description.
    Rank them from best to worst. Return a JSON object with:
    {
      "rankings": [
        {
          "candidateId": "id string",
          "score": 90,
          "reason": "1-2 sentence explanation of why they got this score/rank"
        }
      ]
    }

    Candidates:
    ${candidatesData}

    Job Description:
    """
    ${jobDescription}
    """
  `;

  const fallback = {
    rankings: candidates.map((c, i) => ({
      candidateId: c.id,
      score: 90 - (i * 5),
      reason: "Possesses strong matching experience in core engineering frameworks."
    }))
  };

  const res = await callGeminiJSON(prompt, "You are a recruiter ranking a talent pool.");
  return res || fallback;
};

/**
 * 11. Job Description Generator
 */
export const generateJobDescriptionText = async (title, keyRequirements = "") => {
  const prompt = `
    Generate a professional, compelling, and modern job description for the role: "${title}".
    ${keyRequirements ? `Key requirements to include: ${keyRequirements}` : ''}
    Output a JSON object with:
    {
      "description": "The detailed job description text. Ensure the wording is highly polished and professional.",
      "requirements": "The required qualifications list text (bullet points) including any standard missing requirements that are expected for this role",
      "skills": ["skill1", "skill2", "skill3"],
      "salaryRange": "suggested salary range (e.g. $80,000 - $110,000)",
      "candidateAvailability": "estimated candidate availability/market speed (e.g. High / Average / Low)"
    }
  `;
  const fallback = {
    description: `We are seeking a talented ${title} to join our growing engineering team. You will design, build, and optimize high-performance web systems and collaborate with cross-functional partners.`,
    requirements: "• 3+ years experience\n• Solid understanding of software design principles\n• Strong communication skills",
    skills: ["React", "Node.js", "TypeScript"],
    salaryRange: "$95,000 - $120,000",
    candidateAvailability: "Average"
  };
  const res = await callGeminiJSON(prompt, "You are a professional corporate recruiter.");
  return res || fallback;
};
