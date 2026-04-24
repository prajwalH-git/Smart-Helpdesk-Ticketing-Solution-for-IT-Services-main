import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, AlertCircle } from 'lucide-react';

const cleanAIResponse = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .trim();
};

const TicketModal = ({ isOpen, ticket, onClose, onTicketUpdated, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState('form');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && ticket) {
      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setStep('chat');
      setTicketData(ticket);
      setMessages(ticket.messages || []);
    }
  }, [isOpen, ticket]);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setMessages([]);
      setUserInput('');
      setTicketData(null);
      setStep('form');
      setIsTyping(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startTriage = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setStep('chat');
    setIsTyping(true);
    const userIssueMessage = { role: 'user', content: `Subject: ${title}\n\nDescription: ${description}` };
    setMessages([userIssueMessage]);

    try {
      const res = await axios.post('http://localhost:5000/api/tickets/create', {
        title,
        description,
        userId: user?.id
      });

      setTicketData(res.data);

      const solutionMessage = {
        role: 'assistant',
        content: res.data.aiSuggestion,
        metadata: res.data
      };

      setMessages([userIssueMessage, solutionMessage]);
      if (onTicketUpdated) onTicketUpdated();
    } catch (error) {
      setMessages([
        userIssueMessage,
        { role: 'assistant', content: 'Connection error. Please check the backend and API key.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const newUserMessage = { role: 'user', content: userInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/tickets/chat', {
        messages: updatedMessages,
        category: ticketData?.category || 'General',
        ticketId: ticketData?._id || ticketData?.id
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Chat error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const escalateToHuman = async () => {
    const id = ticketData?._id || ticketData?.id;
    if (!id) return;

    try {
      await axios.patch(`http://localhost:5000/api/tickets/${id}/escalate`);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Escalated to a human agent.' }]);
      setTicketData((prev) => ({ ...prev, status: 'Escalated' }));
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveTicket = async () => {
    const id = ticketData?._id || ticketData?.id;
    if (!id) {
      console.error('No Ticket ID found in ticketData:', ticketData);
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/tickets/${id}/close`, {
        adminFeedback: 'Resolved by user via AI Chat'
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: 'Ticket marked as resolved.' }]);
      setTicketData((prev) => ({ ...prev, status: 'Closed' }));

      if (onTicketUpdated) onTicketUpdated();
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Resolution error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-950 rounded-[2.5rem] w-full max-w-3xl h-[500px] overflow-hidden shadow-2xl border border-slate-800 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>

            <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
              {ticketData?.status || 'NEW_TICKET'}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 justify-center mt-5">
            <div className="bg-blue-800 p-1.5 rounded-lg">
              <Bot className="text-white" size={24} />
            </div>
            <span className="text-white">
              SmartHelp <span className="text-blue-800">AI</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {step === 'form' ? (
              <form onSubmit={startTriage} className="space-y-6">
                <input
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white"
                  placeholder="Subject"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 h-40 text-white"
                  placeholder="Describe the issue in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 rounded-2xl"
                >
                  Analyze and Solve
                </button>
              </form>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`p-4 rounded-2xl ${msg.role === 'assistant'
                          ? 'bg-slate-900 text-blue-50 border border-slate-800'
                          : 'bg-blue-800 text-white'
                        }`}
                    >
                      <p className="text-sm whitespace-pre-line">{cleanAIResponse(msg.content)}</p>
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-blue-400 animate-pulse">AI is thinking...</div>}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {step === 'chat' && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={ticketData?.status?.toLowerCase() === 'escalated' ? "Chat disabled (Escalated)" : "Ask SmartHelp AI for the next troubleshooting step..."}
                  disabled={ticketData?.status?.toLowerCase() === 'escalated'}
                />
                <button
                  type="submit"
                  disabled={isTyping || !userInput.trim() || ticketData?.status?.toLowerCase() === 'escalated'}
                  className="bg-blue-800 p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} className="text-white" />
                </button>
              </form>

              {ticketData && !['closed', 'escalated'].includes(ticketData.status?.toLowerCase()) && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={resolveTicket}
                    className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-bold"
                  >
                    Issue Resolved
                  </button>
                  <button
                    onClick={escalateToHuman}
                    className="text-xs px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-bold flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> Escalate to Human
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
