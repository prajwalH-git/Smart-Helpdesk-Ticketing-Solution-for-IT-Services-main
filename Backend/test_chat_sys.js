require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
    const chatSession = model.startChat({ 
      history: [
        { role: 'user', parts: [{text: 'User: My issue'}] },
        { role: 'model', parts: [{text: 'AI: Turn it off'}] },
        { role: 'user', parts: [{text: 'User: Did not work'}] },
        { role: 'model', parts: [{text: 'AI: Try again'}] }
      ] 
    });
    const result = await chatSession.sendMessage([{ text: "still didn't work" }]);
    console.log("Success:", result.response.text().slice(0, 50));
  } catch (e) {
    console.log("Failed", e.message);
  }
}
test();
