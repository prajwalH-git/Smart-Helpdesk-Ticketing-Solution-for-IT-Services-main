const axios = require('axios');

async function test() {
  try {
    const messages1 = [
      { role: 'user', content: 'Subject: Printer\n\nDescription: It is broken.' },
      { role: 'assistant', content: 'Did you turn it on?' },
      { role: 'user', content: 'yes, still broken' }
    ];

    console.log("Sending query 1...");
    const res1 = await axios.post('http://localhost:5000/api/tickets/chat', {
      messages: messages1,
      category: 'Hardware',
      ticketId: null // We'll mock ticketId as null to avoid db crash for now
    });
    console.log("Query 1 Success:", res1.data.content.slice(0, 50));

    const messages2 = [
      ...messages1,
      { role: 'assistant', content: res1.data.content },
      { role: 'user', content: 'what else should I try?' }
    ];

    console.log("Sending query 2...");
    const res2 = await axios.post('http://localhost:5000/api/tickets/chat', {
      messages: messages2,
      category: 'Hardware',
      ticketId: null
    });
    console.log("Query 2 Success:", res2.data.content.slice(0, 50));

  } catch (err) {
    if (err.response) console.log("Failed HTTP:", err.response.data);
    else console.log("Failed Network:", err.message);
  }
}
test();
