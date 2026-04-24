import React from 'react';

const TicketHistory = ({ tickets }) => (
  <div className="p-10 flex-1 overflow-y-auto">
    <h2 className="text-2xl font-bold mb-6">Global Ticket History</h2>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-4 text-left text-xs font-bold text-slate-500">ID</th>
            <th className="p-4 text-left text-xs font-bold text-slate-500">Issue</th>
            <th className="p-4 text-left text-xs font-bold text-slate-500">User</th>
            <th className="p-4 text-left text-xs font-bold text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map(t => (
            <tr key={t._id}>
              <td className="p-4 font-mono text-xs">#{t._id.slice(-6).toUpperCase()}</td>
              <td className="p-4 font-bold text-sm">{t.title}</td>
              <td className="p-4 text-sm text-slate-500">{t.user?.name || 'Unknown'}</td>
              <td className="p-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                  t.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : 
                  t.status === 'Escalated' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TicketHistory;