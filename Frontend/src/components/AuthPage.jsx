import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Ticket } from "lucide-react";
import axios from "axios";

export default function AuthPage({ onLoginSuccess }) {

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const sendOtp = (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  emailjs.send(
    "service_kj0fd1i",
    "template_mcx12r6",
    { to_email: email, otp },
    "ty-EzVNdhr8VqKTAC"
  )
  .then(() => {
    alert("OTP sent");
    navigate("/verify-otp", {
      state: { otp, name, email, password }
    });
  })
  .catch(() => alert("OTP failed"));
};


 const handleSimpleLogin = async (e) => {
  e.preventDefault();
  try {

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    if (response.data.token) {
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      
      onLoginSuccess(response.data.user); 
      navigate("/dashboard");
    }
  } catch (err) {
   
    console.error("Login error:", err);
    alert("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
  }
};

  return (
    
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-purple-50 to-slate-100"></div>
      <div className="w-full max-w-[900px] h-[550px] bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
       
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col justify-center items-center px-10 text-center">
         
           <div className="flex items-center gap-3 text-2xl font-bold tracking-tight mb-12">
                    <div className="bg-violet-600 p-2 rounded-xl shadow-lg shadow-violet-500/20">
                      <Ticket size={24} />
                    </div>
                    <span>
                      SmartHelp<span className="text-violet-600">AI</span>
                    </span>
                  </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            {isSignup ? "Join Us!" : "Welcome Back!"}
          </h1>
          <p className="text-purple-100 text-lg font-medium">
            Smart Helpdesk Ticketing Solution powered by Gemini AI.
          </p>
        </div>

       
        <div className="relative flex items-center justify-center p-8 bg-white">
          
         
          <div
            className={`w-full max-w-sm transition-all duration-500 absolute
            ${isSignup
              ? "opacity-0 -translate-x-12 pointer-events-none"
              : "opacity-100 translate-x-0 pointer-events-auto"
            }`}
          >

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign In</h2>
            <p className="text-slate-500 mb-8 text-sm">Enter your credentials to access your tickets.</p>

            <form onSubmit={handleSimpleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-slate-900" />
                  Remember me
                </label>
                <span className="text-slate-800 font-semibold hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all">
                Login to Dashboard
              </button>
            </form>

            <p className="text-sm mt-8 text-center text-slate-600">
              Not registered?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-800 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>

      
          <div
              className={`w-full max-w-sm transition-all duration-500 absolute
              ${isSignup
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-12 pointer-events-none"
              }`}
            >

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign Up</h2>
            <p className="text-slate-500 mb-6 text-sm">Register to start resolving issues with AI.</p>

            <form onSubmit={sendOtp} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Create Password"
                required
                className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all mt-2"
              >
                Verify Email with OTP
              </button>
            </form>

            <p className="text-sm mt-6 text-center text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-slate-800 font-bold hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}