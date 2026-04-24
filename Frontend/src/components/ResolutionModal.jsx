import React from 'react';
import { X, CheckCircle, MessageSquare, ShieldCheck } from 'lucide-react';

const ResolutionModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in duration-300">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} />
            <h2 className="font-bold text-xl">Issue Resolved</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest">Official Resolution</span>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
            <p className="text-slate-700 leading-relaxed font-medium">
              {ticket.aiReasoning || "The issue has been successfully resolved by our technical team."}
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            <span>Ticket ID: #{ticket._id.slice(-6).toUpperCase()}</span>
            <span>Resolved At: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolutionModal;