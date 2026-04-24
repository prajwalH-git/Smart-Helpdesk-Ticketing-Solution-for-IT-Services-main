import React, { useState } from 'react';
import { Search, Book, Cpu, Globe, Lock, UserCircle, ChevronRight, ExternalLink, LifeBuoy } from 'lucide-react';

const KnowledgeBase = ({ onOpenTicket }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Book },
    { name: 'Hardware', icon: Cpu },
    { name: 'Software', icon: Globe },
    { name: 'Network', icon: Globe },
    { name: 'Security', icon: Lock },
    { name: 'Account', icon: UserCircle },
  ];

  const articles = [
    { id: 1, category: 'Network', title: 'How to reset your VPN connection', excerpt: 'Step-by-step guide to troubleshooting GlobalProtect and Cisco AnyConnect issues.' },
    { id: 2, category: 'Security', title: 'Reporting suspicious phishing emails', excerpt: 'Learn how to use the "Report Phish" button and what to do if you clicked a link.' },
    { id: 3, category: 'Hardware', title: 'Printer Troubleshooting 101', excerpt: 'Common fixes for paper jams, offline status, and driver installation.' },
    { id: 4, category: 'Account', title: 'Resetting your Multi-Factor Auth (MFA)', excerpt: 'How to move your Microsoft Authenticator to a new mobile device.' },
    { id: 5, category: 'Software', title: 'Installing approved software via Portal', excerpt: 'Access the company Company Portal to install licensed software without Admin rights.' },
    { id: 6, category: 'Network', title: 'Connecting to Office Wi-Fi', excerpt: 'Credentials and certificate requirements for the secure corporate network.' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-purple-50 to-slate-100"></div>
    <div className="flex-1  overflow-y-auto">
     
      <section className="bg-slate-50 border-b border-slate-100 py-16 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase text-blue-800 bg-blue-50 rounded-lg border border-blue-100">
            Self-Service Library
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
            How can we <span className="text-blue-800">help you today?</span>
          </h1>
          
          <div className="relative group max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-800 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or error codes..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-slate-900 outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-blue-800 text-white shadow-lg shadow-blue-900/20 scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-800 hover:text-blue-800'
                }`}
              >
                <Icon size={18} />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              className="group p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-800 hover:shadow-2xl hover:shadow-blue-900/5 transition-all cursor-pointer relative flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-50 px-2 py-1 rounded">
                  {article.category}
                </span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-800 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-800">
                {article.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                {article.excerpt}
              </p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-800 transition-colors">
                <span>5 min read</span>
                <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <LifeBuoy size={48} className="mx-auto text-slate-200 mb-4 animate-spin-slow" />
            <h3 className="text-xl font-bold text-slate-800">No matching articles</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-20">
        <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Still need assistance?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              If you couldn't find a solution in our library, our AI-powered technical support team is available 24/7.
            </p>
            <button onClick={onOpenTicket} className="bg-blue-800 hover:bg-blue-900 px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/50">
              Open a Support Ticket
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </div>

      
      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          © 2025 SmartHelpAI • Intelligence in Every Ticket
        </p>
      </footer>
    </div>
    </>
  );
};

export default KnowledgeBase;