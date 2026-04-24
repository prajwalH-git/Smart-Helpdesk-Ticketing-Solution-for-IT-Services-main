import React from 'react';
import {
  LayoutDashboard,
  Home as HomeIcon,
  Ticket,
  Bot,
  BookOpen,
  HelpCircle,
  LogOut,
  ShieldCheck,
  UserCircle, 
  History    
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800">
      <div className="p-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight mb-12">
          <div className="bg-blue-800 p-1.5 rounded-lg">
                      <Bot className="text-white" size={24} />
                    </div>
          <span>
            SmartHelp<span className="text-blue-800">AI</span>
          </span>
        </div>

       
        <nav className="space-y-2">
         
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
              activeTab === 'home' 
                ? 'bg-blue-800 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HomeIcon size={20} /> Home
          </button>

        
          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Admin Control
              </div>
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck size={20} /> Resolve
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'history' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <History size={20} /> Ticket History
              </button>
            </>
          )}

        
          {user?.role !== 'admin' && (
            <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={20} /> My Tickets
            </button>

              <button
            onClick={() => setActiveTab('kb')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
              activeTab === 'kb'
                ? 'bg-blue-800 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={20} /> Knowledge Base
          </button>

          <button 
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
              activeTab === 'help'
                ? 'bg-blue-800 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={20} /> Get Help
          </button>


            </>
          )}

        </nav>
      </div>

    
      <div className="mt-auto p-8 border-t border-slate-900">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-500 border border-slate-800 p-3.5 rounded-xl font-semibold text-slate-400 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;