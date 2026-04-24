import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import VerifyOtp from './components/VerifyOtp.jsx';
import { AppWindow } from 'lucide-react';
import Features from './components/Features.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();


 
  const handleLandingEnter = (mode) => {
   
    navigate("/auth", { state: { initialMode: mode } });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); 
  };
  useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (token && savedUser) {
    setIsAuthenticated(true);
    setUser(JSON.parse(savedUser));
  }
}, []);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage onEnter={(mode) => handleLandingEnter(mode)} />} />
        <Route 
          path="/auth" 
          element={<AuthPage onLoginSuccess={handleLogin} />} 
        />
        <Route
          path="/verify-otp"
          element={<VerifyOtp onLoginSuccess={handleLogin} />}
        />
        <Route path="/features" element={<Features />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        
      </Routes>
    </div>
  );
}

export default App;