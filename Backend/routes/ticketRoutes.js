const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function categorizeTicket(title, description) {
  const searchText = `${title} ${description}`.toLowerCase();

  let category = 'Other';
  let priority = 'Medium';
  let department = 'Help Desk';
  let reasoning = 'Manual keyword-based classification';

  if (searchText.match(/\b(network|internet|wifi|wi-fi|vpn|router|lan|wan|disconnect|no internet|slow internet|connection failed)\b/)) {
    category = 'Network';
    department = 'Network Team';
  } else if (searchText.match(/\b(security|virus|malware|hack|phishing|breach|ransomware|suspicious)\b/)) {
    category = 'Security';
    department = 'Security Team';
    priority = 'High';
  } else if (searchText.match(/\b(login|password|account|locked|access denied|permission)\b/)) {
    category = 'Account';
    department = 'Help Desk';
  } else if (searchText.match(/\b(lag|hanging|software|application|app crash|install|update|bug|error code)\b/)) {
    category = 'Software';
    department = 'IT Support';
  } else if (searchText.match(/\b(touch|printer|keyboard|mouse|monitor|cpu|laptop|desktop|hardware|physical damage)\b/)) {
    category = 'Hardware';
    department = 'IT Support';
  }

  if (searchText.match(/\b(down|not working|urgent|critical|unable|failed)\b/)) {
    priority = 'High';
  }

  if (category === 'Other' && process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
      const prompt = `You are an IT support classifier. Read the ticket below and respond with a JSON object. We need "category", "priority", and "department".
Category must be Hardware, Software, Network, Account, Security, or Other.
Priority must be Low, Medium, High, or Critical.
Department must be IT Support, Network Team, Security Team, Help Desk, or Unassigned.
Return ONLY valid JSON.

Ticket Title: ${title}
Ticket Description: ${description}`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();
      // Strip markdown code blocks if the model outputs them
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const json = JSON.parse(text);

      const validCategories = ['Hardware', 'Software', 'Network', 'Account', 'Security', 'Other'];
      const validDepartments = ['IT Support', 'Network Team', 'Security Team', 'Help Desk', 'Unassigned'];
      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];

      return {
        category: validCategories.includes(json.category) ? json.category : 'Other',
        priority: validPriorities.includes(json.priority) ? json.priority : 'Medium',
        department: validDepartments.includes(json.department) ? json.department : 'Help Desk',
        confidence: 0.9,
        reasoning: 'Gemini assisted classification'
      };
    } catch (err) {
      console.error('AI Categorization Failed:', err.message);
    }
  }

  return { category, priority, department, confidence: 0.85, reasoning };
}

router.post('/create', async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const ai = await categorizeTicket(title, description);

    const ticket = new Ticket({
      user: userId,
      title,
      description,
      category: ai.category,
      priority: ai.priority,
      department: ai.department,
      aiConfidence: ai.confidence,
      aiReasoning: ai.reasoning,
      status: 'Open',
      messages: [{ role: 'user', content: description }]
    });

    ticket.calculateSLA();
    await ticket.save();

    const aiSolution = await generateInitialResponse(ticket);

    // Persist the AI solution so it remains in the chatbox history
    await Ticket.findByIdAndUpdate(ticket._id, {
      $push: {
        messages: { role: 'assistant', content: aiSolution }
      }
    });

    res.json({
      _id: ticket._id,
      title: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      department: ticket.department,
      confidence: ticket.aiConfidence,
      aiSuggestion: aiSolution
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ticket creation failed' });
  }
});

async function generateInitialResponse(ticket, attempt = 1) {
  if (!process.env.GEMINI_API_KEY) {
    return `I've categorized this as ${ticket.category}. Please wait for a human agent.`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
    const prompt = `You are a friendly IT Support Assistant.
Strict rules:
1. Use plain text only.
2. Provide a thorough, step-by-step comprehensive solution to the user's issue.
3. Advise the user to reply if the issue persists or if they need further clarification.
4. If the issue sounds risky or security-related, advise the user not to share passwords and wait for an agent.

Issue: ${ticket.title}
Details: ${ticket.description}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim() || "I am currently unable to generate a solution. Please type your query below and I will assist you!";
  } catch (err) {
    console.error(`AI Response Failed (Attempt ${attempt}):`, err.message);
    if (attempt < 3 && err.message.includes('503')) {
      await new Promise(res => setTimeout(res, 2000));
      return generateInitialResponse(ticket, attempt + 1);
    }
    return "I am currently unable to generate a solution. Please type your query below and I will assist you!";
  }
}

router.post('/chat', async (req, res) => {
  try {
    const { messages, category, ticketId } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ content: 'AI Chat is currently unavailable. (API Key missing)' });
    }

    const systemInstruction = `You are SmartHelp AI, a calm IT support chat assistant for helpdesk tickets.
Stay focused on the user's IT issue.
Use plain text only. Avoid formatting with markdown if possible.
Keep replies practical, concise, and easy to follow.
Category context: ${category || 'General'}.
If the user asks for secrets, passwords, or unsafe actions, refuse and recommend escalation.`;

    const model = genAI.getGenerativeModel({
      model: "gemma-3-1b-it"
    });

    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    let reply = "";

    if (geminiMessages.length > 0) {
      const lastUserMessage = geminiMessages.pop();

      const chatSession = model.startChat({
        history: geminiMessages
      });

      const userContextString = `[System Context: You are SmartHelp AI, a calm IT support chat assistant. Category: ${category || 'General'}. Refuse unsafe requests.]\n\nUser: ${lastUserMessage.parts[0].text}`;
      const result = await chatSession.sendMessage([{ text: userContextString }]);
      reply = result.response.text().trim();
    } else {
      reply = "Hello! How can I assist you with your IT issue today?";
    }

    if (ticketId && messages.length > 0) {
      await Ticket.findByIdAndUpdate(ticketId, {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: messages[messages.length - 1].content },
              { role: 'assistant', content: reply }
            ]
          }
        }
      });
    }

    res.json({ content: reply });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ content: 'AI service unavailable' });
  }
});

router.patch('/:id/escalate', async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    {
      status: 'Escalated',
      assignedTo: 'Human Agent',
      $push: { messages: { role: 'assistant', content: 'Escalated to a human agent. An IT support specialist will review this ticket soon.' } }
    },
    { new: true }
  );
  res.json(ticket);
});

router.patch('/:id/close', async (req, res) => {
  try {
    const adminFeedback = req.body ? req.body.adminFeedback : undefined;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Closed',
        'sla.resolvedAt': new Date(),
        ...(adminFeedback && { aiReasoning: adminFeedback })
      },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});

router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all tickets" });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching user tickets:", err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.delete('/:id', async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
