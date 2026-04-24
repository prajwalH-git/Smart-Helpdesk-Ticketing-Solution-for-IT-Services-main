import React from 'react';
import { 
  Zap, Bot, Shield, BarChart3, 
  Clock, MessageSquare, Cpu, Globe 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const featureList = [
    {
      title: "Gemini 2.0 AI Engine",
      description: "The backend uses Gemini 2.0 to automatically analyze ticket text and assign them to categories like Hardware, Software, or Network.",
      icon: <Cpu className="text-blue-600" size={28} />,
      badge: "AI Powered"
    },
    {
      title: "Real-time AI Chatbot",
      description: "Interactive triage system that provides instant self-service resolutions before human intervention.",
      icon: <Bot className="text-indigo-600" size={28} />,
      badge: "Interactive"
    },
    {
      title: "Instant Escalation Mechanism",
      description: `Users can trigger a PATCH request that instantly flags a ticket as "Escalated," moving it from the AI chat to a human admin's priority queue.`,
      icon: <Zap className="text-amber-500" size={28} />,
      badge: "Efficiency"
    },
    {
      title: "Role-Based Access Control",
      description: "The system uses JWT tokens to distinguish between standard users and admins, restricting sensitive management tools to authorized personnel only",
      icon: <Globe className="text-emerald-600" size={28} />,
      badge: "Access control"
    },
    {
      title: "Official Admin Resolution",
      description: "dmins can submit final solutions through a dedicated portal, which the backend saves and displays to the user as a verified resolution",
      icon: <Clock className="text-purple-600" size={28} />,
      badge: "Admin"
    },
    {
      title: "Secure Authentication",
      description: "Robust security with JWT tokens and OTP verification for protected user data.",
      icon: <Shield className="text-rose-600" size={28} />,
      badge: "Security"
    }
  ];

  return (
    <div className=" min-h-screen font-sans">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-purple-50 to-slate-100"></div>
        
              <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                  <div className="bg-violet-600 p-1.5 rounded-lg">
                    <Bot className="text-white" size={24} />
                  </div>
                  <span>SmartHelp <span className="text-violet-600">AI</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                  <Link to="/features" className="hover:text-violet-600 transition-colors">Features</Link>
                 
                  <button 
                    onClick={() => navigate('/auth')} 
                    className="hover:text-violet-600 transition-colors"
                  >
                    Login
                  </button>
                  
                  <button 
                    onClick={() => navigate('/auth')}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md"
                  >
                    Sign Up Free
                  </button>
                </div>
              </nav>
      <section className=" py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none">
            Next-Gen <span className="text-violet-600">Support Logic.</span>
          </h1>
          <p className="text-xl font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
            SmartHelpAI isn't just a ticketing tool—it's a neural infrastructure 
            designed to solve problems before they reach your desk.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 ">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9">
          {featureList.map((feature, index) => (
            <div key={index} className="group relative bg-violet-100 p-5 rounded-3xl ">
              <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-violet-50 group-hover:text-violet-600 shadow-sm border border-slate-100">
                {feature.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-800 mb-2 block">
                {feature.badge}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          © 2025 SmartHelpAI • Intelligence in Every Ticket
        </p>
      </footer>
    </div>
  );
};

export default Features;