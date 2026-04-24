import React from 'react';
import { 
  ShieldCheck, Activity, Globe, Cpu, Users, 
  BarChart3, Clock, AlertTriangle, Sparkles, Ticket 
} from 'lucide-react';

const AdminHome = ({ username, stats }) => {
  return (
    <div className="p-10 flex-1 overflow-y-auto bg-slate-50">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-200 px-4 py-2 rounded-full text-blue-800 text-xs font-black mb-6">
          <ShieldCheck size={14} className="animate-pulse" />
          <span className="uppercase tracking-[0.2em]">System Administrator Console</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
          Control Center, <span className="text-blue-800">{username}</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          Global infrastructure oversight and AI performance monitoring. 
          Manage escalated tickets and system health from this unified dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { 
            label: "Pending Escalations", 
            val: stats?.pendingEscalations || 0, 
            color: "text-rose-600", 
            icon: AlertTriangle 
          },
          { 
            label: "Total Issues Raised", 
            val: stats?.totalIssuesRaised || 0, 
            color: "text-blue-600", 
            icon: Ticket 
          },
          { 
            label: "System Load", 
            val: stats?.systemLoad || "0%", 
            color: "text-emerald-600", 
            icon: BarChart3 
          },
          { 
            label: "Avg. Resolution", 
            val: stats?.avgResolveTime || "0m", 
            color: "text-purple-600", 
            icon: Clock 
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <stat.icon size={20} className={stat.color} />
            </div>
   
            <p className={`text-4xl font-black ${stat.color}`}>
              {typeof stat.val === 'number' && stat.val < 10 ? `0${stat.val}` : stat.val}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Node Infrastructure Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Security Clusters", desc: "Firewall & MFA nodes", icon: ShieldCheck, color: "bg-blue-600", width: "90%" },
            { name: "Network Traffic", desc: "VPN & Global Gateways", icon: Globe, color: "bg-emerald-600", width: "75%" },
            { name: "AI Compute", desc: "Gemini Neural Units", icon: Cpu, color: "bg-purple-600", width: "40%" }
          ].map((node, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 border border-slate-100">
                <node.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{node.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{node.desc}</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`${node.color} h-full`} style={{ width: node.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

  
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">
              <Sparkles size={16} /> Neural Compute Engine
            </div>
            <h2 className="text-3xl font-bold mb-4">AI Service Integrity</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitoring global ticket trends and training local models to improve auto-resolution accuracy.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center min-w-[120px]">
              <p className="text-2xl font-black">142</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Active Sessions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center min-w-[120px]">
              <p className="text-2xl font-black">0.8s</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Categorization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;