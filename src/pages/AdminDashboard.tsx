import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Sprout, DollarSign, Leaf, CloudSun, Bot, FileText, Settings, LogOut} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalCrops: 0, totalHarvests: 0, totalExpenses: 0, totalEarnings: 0 });
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Profile දත්ත
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", config);
        setAdminName(profileRes.data.name);

        // Stats දත්ත
        const statsRes = await axios.get("http://localhost:5000/api/dashboard/stats", config);
        console.log("API Response:", statsRes.data); // දත්ත එනවාදැයි බැලීමට
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10">Smart Farming<br/>
            <span className="text-sm font-normal text-green-200">Management System</span>
          </h1>
          
          <nav className="space-y-2">
            <button onClick={() => navigate("/admin-dashboard")} className="flex items-center gap-3 w-full bg-green-900/50 p-3 rounded-lg">
              <LayoutDashboard size={20}/> Dashboard
            </button>
            <button onClick={() => navigate("/users")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <Users size={20}/> Users
            </button>
            <button onClick={() => navigate("/admin/crops")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <Leaf size={20}/> Crops
            </button>
            <button onClick={() => navigate("/admin/expenses")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <DollarSign size={20}/> Expenses
            </button>
            <button onClick={() => navigate("/admin/harvests")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <Sprout size={20}/> Harvests
            </button>
            <button onClick={() => navigate("/admin/weather")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <CloudSun size={20}/> Weather
            </button>
            <button onClick={() => navigate("/admin/ai")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <Bot size={20}/> AI Assistant
            </button>
            <button onClick={() => navigate("/admin/reports")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <FileText size={20}/> Reports
            </button>
            <button onClick={() => navigate("/admin/settings")} className="flex items-center gap-3 w-full p-3 hover:bg-green-900/30 rounded-lg">
              <Settings size={20}/> Settings
            </button>
          </nav>
        </div>
        
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-red-100">
          <LogOut size={20}/> Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Welcome back, {adminName}! 👋</h2>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <p className="text-sm text-gray-500">Total Crops</p>
             <h3 className="text-2xl font-bold mt-1">{stats.totalCrops}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <p className="text-sm text-gray-500">Total Harvests</p>
             <h3 className="text-2xl font-bold mt-1">{stats.totalHarvests}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <p className="text-sm text-gray-500">Total Earnings</p>
             <h3 className="text-2xl font-bold mt-1">LKR {stats.totalEarnings.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <p className="text-sm text-gray-500">Total Expenses</p>
             <h3 className="text-2xl font-bold mt-1">LKR {stats.totalExpenses.toLocaleString()}</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;