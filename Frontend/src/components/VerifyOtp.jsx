import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyOtp({ onLoginSuccess }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

  
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp !== state?.otp?.toString()) {
      alert("Invalid OTP code. Please check and try again.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: state.name,
        email: state.email,
        password: state.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user for persistence
      onLoginSuccess(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-purple-50 to-slate-100"></div>
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-200">
        
        
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Verify Email</h2>
        <p className="text-slate-500 text-sm mb-8">
          We've sent a 6-digit code to <br />
          <span className="font-bold text-slate-800">{state?.email}</span>
        </p>

  
        <div className="flex gap-2 justify-center mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

     
        <button
          onClick={verifyOtp}
          disabled={isLoading || otp.join("").length < 6}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 mb-6"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={20} /> : "Verify & Register"}
        </button>

        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Didn't receive code?{" "}
            <button 
              disabled={timer > 0}
              className={`font-bold ${timer > 0 ? "text-slate-300" : "text-blue-600 hover:underline"}`}
            >
              Resend {timer > 0 && `(0:${timer < 10 ? `0${timer}` : timer})`}
            </button>
          </p>
          
          <button 
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-semibold w-full"
          >
            <ArrowLeft size={14} /> Back to Sign Up
          </button>
        </div>
      </div>
    </div>
     </>
  );
}