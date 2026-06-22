import React, { useState } from "react";
import { registerUser } from "../services/authService";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerUser({ name, email, password, role });
      setSuccess("Registration Successful! Redirecting...");
      setName("");
      setEmail("");
      setPassword("");
      setRole("farmer");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div 
      className="h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat font-sans"
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://bricsbridge.com/wp-content/uploads/2025/12/7-1.jpg')" 
      }}
    >
      <div className="bg-white/20 backdrop-blur-[15px] border border-white/30 rounded-[20px] p-8 w-[380px] shadow-2xl text-center text-black">
        <h2 className="m-0 mb-1 text-[26px] font-bold text-white">Create Account</h2>
        <p className="m-0 mb-5 text-gray-200 text-xs font-medium">Join our Smart Farming Community 🚜</p>

        {error && (
          <div className="bg-red-500/20 border border-red-400 p-2 rounded-lg mb-4 text-xs text-red-100 font-medium text-left">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-400 p-2 rounded-lg mb-4 text-xs text-green-100 font-medium text-left">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col text-left space-y-4">
          <div>
            <label className="block mb-1 text-xs font-semibold text-white">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-white">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-white">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="farmer" className="text-black">Farmer</option>
              <option value="admin" className="text-black">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-lg text-sm font-bold mt-2 transition-all duration-300 active:scale-[0.98]"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-200 font-medium">
          Already have an account?{" "}
          <a href="/login" className="text-white font-bold underline hover:text-green-300">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;