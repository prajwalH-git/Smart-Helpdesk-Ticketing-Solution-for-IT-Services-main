import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, Send, CheckCircle } from 'lucide-react';

const AdminPanel = ({ tickets, onRefresh }) => {
  const [resolution, setResolution] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  const escalatedTickets = tickets.filter(t => t.status === 'Escalated');

  const handleResolve = async (id) => {
    if (!resolution.trim()) return;
    try {
      await fetch(`http://localhost:5000/api/tickets/${id}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminFeedback: resolution })
      });
      setResolution('');
      setResolvingId(null);
      onRefresh();
    } catch (err) {
      console.error("Resolution failed", err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-amber-500 p-2 rounded-lg text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Resolution Center</h1>
          <p className="text-slate-500">Address escalated tickets that require human intervention.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {escalatedTickets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4 opacity-20" />
            <p className="text-slate-400 font-medium text-lg">Queue Clear! No escalated tickets pending.</p>
          </div>
        ) : (
          escalatedTickets.map(ticket => (
            <div key={ticket._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded uppercase tracking-wider">Escalated</span>
                  <span className="text-slate-400 text-xs font-mono">#{ticket._id.slice(-8)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{ticket.title}</h3>
                <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">{ticket.description}</p>
              </div>

              <div className="bg-slate-50/50 p-6 border-l border-slate-100 w-full md:w-96">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Admin Resolution</label>
                <textarea 
                  className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Provide feedback and solve..."
                  value={resolvingId === ticket._id ? resolution : ''}
                  onChange={(e) => {
                    setResolvingId(ticket._id);
                    setResolution(e.target.value);
                  }}
                />
                <button 
                  onClick={() => handleResolve(ticket._id)}
                  className="w-full mt-3 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                >
                  Submit & Resolve <Send size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;