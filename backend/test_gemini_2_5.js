import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testModel(modelName) {
  console.log(`\nTesting Gemini API with model: ${modelName}...`);
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const prompt = `
      Analyze this sample text. Output a JSON object containing:
      {
        "status": "success",
        "message": "Model is functional"
      }
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(`SUCCESS for ${modelName}! Response:`, response.text().trim());
    return true;
  } catch (error) {
    console.error(`FAILED for ${modelName}:`, error.message);
    return false;
  }
}

async function run() {
  await testModel('gemini-2.5-flash');
  await testModel('gemini-2.5-pro');
  process.exit(0);
}

run();
