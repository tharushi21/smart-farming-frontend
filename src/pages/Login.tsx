import React, { useState } from "react";
import { loginUser } from "../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  try {
    const data = await loginUser({ email, password });
    
    // data.user කියන්නේ object එකක්
    const role = data.user.role; 

    setSuccess("Login Successful!");
    
    setTimeout(() => {
      // Role එක අනුව තීරණය කිරීම
      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    }, 1000);
    
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div 
      className="h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat font-sans"
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200')" 
      }}
    >
      <div className="bg-white/25 backdrop-blur-[12px] border border-white/40 rounded-[20px] p-10 w-[400px] shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] text-center text-black">
        <h2 className="m-0 mb-2 text-[28px] font-bold text-white">Smart Farming Login</h2>
        <p className="m-0 mb-6 text-[#333333] text-sm font-medium">Welcome back! 🌱</p>

        {error && (
          <div className="bg-red-500/15 border border-[#ff4d4d] p-2.5 rounded-lg mb-[15px] text-sm text-[#cc0000] font-medium text-left">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/15 border border-[#2ecc71] p-2.5 rounded-lg mb-[15px] text-sm text-[#1e7e34] font-medium text-left">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col text-left">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-black">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full p-3 rounded-lg border border-black/20 bg-white/50 text-black text-[15px] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-800/40 box-border"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-black/20 bg-white/50 text-black text-[15px] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-800/40 box-border"
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-green-800 hover:bg-green-900 text-white border-none p-3.5 rounded-lg text-base font-bold cursor-pointer mt-2.5 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-5 text-sm text-[#222222] font-medium">
          Don't have an account?{" "}
          <a href="/register" className="text-[#222222] font-bold underline hover:text-black transition-colors">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;