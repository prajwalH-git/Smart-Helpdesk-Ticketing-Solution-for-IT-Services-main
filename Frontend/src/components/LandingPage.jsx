import React from "react";
import { Link } from "react-router-dom";
import { Bot, Zap, ShieldCheck, ArrowRight, Ticket } from "lucide-react";
import "./LandingPage.css";

const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Ticket size={24} />
            </div>
            <span className="logo-text">SmartHelp<span className="logo-accent">AI</span></span>
          </div>
          <div className="nav-buttons">
            <Link to="/features" className="nav-link">Features</Link>
            <button onClick={() => onEnter('login')} className="btn-login">Sign In</button>
            <button onClick={() => onEnter('signup')} className="btn-signup">Get Started</button>
          </div>
        </div>
      </nav>

      <header className="landing-header">
        <div className="badge">
          <Zap size={14} />
          <span>AI-POWERED IT SUPPORT</span>
        </div>
        <h1>Smart Helpdesk Ticketing System</h1>
        <p>
          Experience the future of IT support with Gemini-powered AI that classifies issues in milliseconds and provides instant resolutions.
        </p>
        <div className="header-buttons">
          <button onClick={() => onEnter('signup')} className="btn-primary">
            Start Free Trial
            <ArrowRight size={18} />
          </button>
          <Link to="/features" className="btn-secondary">
            Learn More
          </Link>
        </div>
      </header>

      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">
            <Bot size={28} />
          </div>
          <h3>AI-Powered Classification</h3>
          <p>Gemini 2.0 automatically analyzes and categorizes tickets into Hardware, Software, or Network issues.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Zap size={28} />
          </div>
          <h3>Instant Escalation</h3>
          <p>Smart escalation mechanism moves critical issues from AI to human admins in real-time.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <ShieldCheck size={28} />
          </div>
          <h3>Secure & Reliable</h3>
          <p>Enterprise-grade security with JWT authentication and OTP verification for protected data.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
