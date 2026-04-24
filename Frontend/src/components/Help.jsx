import React from "react";
import { 
  Activity, Mail, Phone, MapPin, 
  ShieldCheck, Globe, Cpu, Zap, 
  MessageSquare, ArrowRight 
} from "lucide-react";

export default function Help({ user, onOpenTicket }) {
  return (
    <div className=" text-slate-900 min-h-screen font-sans relative overflow-y-auto">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-purple-50 to-slate-100"></div>
      <style>
        {`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeInUp 0.6s ease-out forwards; }
          .infra-card { background: white; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
          .infra-card:hover { border-color: #3b82f6; box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.1); }
        `}
      </style>

      <section className=" border-b border-slate-100 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-10">
          <div className="animate-fade-up text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase text-violet-800 bg-violet-50 rounded-lg border border-violet-100">
              Technical Support Hub
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6">
              Need <span className="text-violet-600">Assistance?</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Our AI-driven infrastructure is monitored 24/7. Use our smart tools below to resolve issues or connect with a specialist.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 -mt-16 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
        
          <div className="lg:col-span-1 space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="infra-card p-8 rounded-[2.5rem] relative overflow-hidden group h-full">
              <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <Activity size={20} className="text-blue-800 animate-pulse" />
                System Integrity
              </h3>
              <div className="space-y-5">
                {[
                  { n: "API Gateway", s: "Operational", c: "text-emerald-600" },
                  { n: "Neural Compute", s: "Healthy", c: "text-emerald-600" },
                  { n: "Data Clusters", s: "Synced", c: "text-emerald-600" },
                  { n: "SLA Response", s: "99.8%", c: "text-blue-600" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">{item.n}</span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${item.c}`}>{item.s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Global Latency (ms)</p>
                <div className="flex gap-1.5 h-16 items-end">
                  {[40, 70, 55, 90, 65, 85, 50, 75].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid md:grid-cols-2 gap-6">
           
              <div className="infra-card p-8 rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-800"><Mail size={18}/></div>
                      COM-3@gmail.com
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-800"><Phone size={18}/></div>
                      +91 7026450939
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-800"><MapPin size={18}/></div>
                      Yelhanka, Rajanukunte, Bengaluru
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between group cursor-pointer" onClick={onOpenTicket}>
                <div>
                  <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap size={24} className="fill-current" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Launch AI Triage</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Our Gemini-powered engine can resolve 90% of issues instantly through interactive chat.
                  </p>
                </div>
                <div onClick={onOpenTicket} className="flex items-center gap-2 text-blue-400 font-bold text-sm mt-6">
                  Start Troubleshooting <ArrowRight size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Network", icon: Globe, status: "Stable" },
                { label: "Hardware", icon: Cpu, status: "Active" },
                { label: "Security", icon: ShieldCheck, status: "Secure" }
              ].map((node, i) => (
                <div key={i} className="infra-card p-6 rounded-3xl text-center">
                  <node.icon size={20} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{node.label}</p>
                  <p className="text-xs font-bold text-slate-900">{node.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[500px] bg-slate-200 overflow-hidden">
        <iframe
          title="Presidency University Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3884.6584922758846!2d77.54005207507866!3d13.173616287267794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1f8b6e3b3b3b%3A0x1f8b6e3b3b3b3b3b!2sPresidency%20University%2C%20Ittagallpura!5e0!3m2!1sen!2sin!4v1737028900000!5m2!1sen!2sin"
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
          loading="lazy"
        ></iframe>
        <div className="absolute bottom-10 left-10 contact-card p-6 rounded-2xl max-w-xs animate-slide-left hidden md:block">
            <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Find Us</h4>
            <p className="text-xs text-slate-500">Global IT Support Center, Rajanakunte, Presidency University, Bengaluru, Karnataka.</p>
        </div>
      </div>

   
      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          © 2025 SmartHelpAI • Intelligence in Every Ticket
        </p>
      </footer>
    </div>
  );
}