import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini2_0() {
  console.log("Testing Gemini API with model: gemini-2.0-flash...");
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const prompt = `
      Analyze this sample text. Output a JSON object containing:
      {
        "status": "success",
        "message": "Gemini 2.0 is functional"
      }
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("SUCCESS! Response text:", response.text().trim());
  } catch (error) {
    console.error("FAILED! Gemini 2.0 API failed:", error.message);
  }
}

testGemini2_0();
