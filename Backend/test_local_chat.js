require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function test() {
  const messages = [
    { role: 'user', content: 'Subject: Printer\n\nDescription: It is broken.' },
    { role: 'assistant', content: 'Did you turn it on?' },
    { role: 'user', content: 'yes, still broken' }
  ];

  try {
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });

    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    const lastUserMessage = geminiMessages.pop();

    const chatSession = model.startChat({
      history: geminiMessages
    });

    const userContextString = `[System Context: You are SmartHelp AI, a calm IT support chat assistant. Category: Hardware. Refuse unsafe requests.]\n\nUser: ${lastUserMessage.parts[0].text}`;
    
    console.log("History:", JSON.stringify(geminiMessages, null, 2));
    
    const result = await chatSession.sendMessage([{ text: userContextString }]);
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Chat Error:", err.message);
  }
}
test();
