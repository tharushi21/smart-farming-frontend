
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // API එකෙන් එන දත්ත තබා ගන්නා state එක
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalExpenses: 0,
    totalEarnings: 0,
    netProfit: 0
  });

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Crops", path: "/crops", icon: "🌱" },
    { name: "Weather", path: "/weather", icon: "☀️" },
    { name: "AI Assistant", path: "/ai-assistant", icon: "🤖" },
    { name: "Reports", path: "/reports", icon: "📊" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  // API එකෙන් දත්ත ලබා ගැනීම
  useEffect(() => {
    api.get(
  "/reports/summary",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)
    .then(res => setStats(res.data))
    .catch(err => console.error("Error fetching report data:", err));
  }, []);

  // Chart සඳහා උදාහරණ දත්ත (පසුකාලීනව Backend එකෙන් දත්ත ගෙන මෙතනට දාන්න පුළුවන්)
  const expenseData = [
    { name: 'Jan', Expenses: 70000, Earnings: 30000 },
    { name: 'Feb', Expenses: 50000, Earnings: 90000 },
    { name: 'Mar', Expenses: 55000, Earnings: 110000 },
    { name: 'Apr', Expenses: 65000, Earnings: 120000 },
    { name: 'May', Expenses: 70000, Earnings: 130000 },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between p-5">
        <div>
          <h2 className="text-xl font-bold mb-8 px-2">🌿 Smart Farming</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${location.pathname === item.path ? "bg-[#0f766e]" : "hover:bg-[#0f766e]/40"}`}>
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-gray-500 mb-6">Analyze your farm performance</p>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[ 
            { title: "Total Crops", val: stats.totalCrops }, 
            { title: "Total Expenses", val: `LKR ${stats.totalExpenses.toLocaleString()}` }, 
            { title: "Total Earnings", val: `LKR ${stats.totalEarnings.toLocaleString()}` }, 
            { title: "Net Profit", val: `LKR ${stats.netProfit.toLocaleString()}` } 
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border">
              <p className="text-sm text-gray-500">{card.title}</p>
              <h2 className="text-2xl font-bold">{card.val}</h2>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-bold mb-4">Expenses vs Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Expenses" fill="#ef4444" />
                <Bar dataKey="Earnings" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-bold mb-4">Profit Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Earnings" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 