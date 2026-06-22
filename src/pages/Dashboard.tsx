import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalCrops: 0,
    totalExpenses: 0,
    totalHarvests: 0,
    totalEarnings: 0,
    profit: 0,
    recentExpenses: [],
    recentHarvests: []
  });

  // Weather state එක
  const [weather, setWeather] = useState({ temp: 0, description: "Loading..." });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const savedUserString = localStorage.getItem("user");
  const loggedInUser = savedUserString ? JSON.parse(savedUserString).name : "Guest User";
  const [chartData, setChartData] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("Loading...");
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'How can I help you?' }]);
const [input, setInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 1. Dashboard Stats ලබාගැනීම
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", { headers });
        setDashboardData(res.data);

        // 2. Weather දත්ත ලබාගැනීම (අපේ අලුත් Weather route එක)
        const weatherRes = await axios.get("http://localhost:5000/api/weather/data", { headers });
        setWeather(weatherRes.data);

        // 3. Chart Data ලබාගැනීම
        const chartRes = await axios.get("http://localhost:5000/api/dashboard/chart", { headers });
        setChartData(chartRes.data);
        
        const aiRes = await axios.get("http://localhost:5000/api/ai/advice", { headers });
        setAiAdvice(aiRes.data.advice);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);
 const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = { sender: 'user', text: input };
  setMessages((prev) => [...prev, userMsg]);
  const currentInput = input;
  setInput('');

  try {
    const token = localStorage.getItem("token");
    // මෙතන අනිවාර්යයෙන්ම Backend එකේ route එකට request එක යන්න ඕනේ
    const res = await axios.post(
      "http://localhost:5000/api/ai/chat", 
      { message: currentInput },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // AI එකෙන් එන උත්තරය messages වලට එකතු කිරීම
    setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
  } catch (err) {
    console.error("Chat Error:", err);
    setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry!" }]);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between p-5 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <span className="text-3xl">🌿</span>
            <div>
              <h2 className="text-lg font-bold leading-tight">Smart Farming</h2>
              <p className="text-xs text-green-300">Management System</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
  <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">📊 Dashboard</button>
  <button onClick={() => navigate("/crops")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">🌱 Crops</button>
  <button onClick={() => navigate("/expenses")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">💰 Expenses</button>
  <button onClick={() => navigate("/harvests")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">🌾 Harvests</button>
  
  {/* අලුත් ඒවා මෙතනින් */}
  <button onClick={() => navigate("/weather")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">☀️ Weather</button>
  <button onClick={() => navigate("/ai-assistant")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">🤖 AI Assistant</button>
  <button onClick={() => navigate("/reports")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">📊 Reports</button>
  <button onClick={() => navigate("/settings")} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0f766e]/40 rounded-xl font-medium text-gray-300 w-full text-left">⚙️ Settings</button>
</nav>
        </div>
        <div className="flex items-center justify-between bg-[#042f24] p-3 rounded-xl border border-green-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center font-bold text-xs">{loggedInUser.charAt(0)}</div>
            <h4 className="text-sm font-bold">{loggedInUser}</h4>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-xs font-bold">Logout</button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {loggedInUser}! 🌱</h1>
        </header>

        <main className="p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { label: "Total Crops", value: dashboardData.totalCrops, icon: "🌱", color: "green" },
              { label: "Total Expenses", value: `LKR ${dashboardData.totalExpenses.toLocaleString()}`, icon: "👛", color: "red" },
              { label: "Total Harvests", value: dashboardData.totalHarvests, icon: "📈", color: "amber" },
              { label: "Total Earnings", value: `LKR ${dashboardData.totalEarnings.toLocaleString()}`, icon: "💵", color: "blue" },
              { label: "Net Profit", value: `LKR ${dashboardData.profit.toLocaleString()}`, icon: "💰", color: "emerald" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  <h3 className={`text-2xl font-bold mt-1 ${stat.label === "Net Profit" && dashboardData.profit < 0 ? 'text-red-600' : 'text-gray-900'}`}>{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-2xl`}>{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Crop Expenses</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#064e3b] text-white text-xs font-bold px-3 py-1.5 rounded-lg"> + Add New</button>
              </div>
              <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
                </thead>
                <tbody className="text-sm font-medium text-gray-700">
                  {dashboardData.recentExpenses && dashboardData.recentExpenses.length > 0 ? (
                    dashboardData.recentExpenses.map((exp: any, index: number) => (
                      <tr key={exp._id || index} className="border-b border-gray-50">
                        <td className="p-3">{exp.title}</td>
                        <td className="p-3"><span className="bg-green-100 text-green-700 px-2 rounded-full text-xs font-bold">{exp.category}</span></td>
                        <td className="p-3 font-bold">Rs. {exp.amount.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{new Date(exp.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-400">No cost data available!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
  <h3 className="text-base font-bold mb-4">Expenses vs Earnings</h3>
  
  {/* මෙතන height එක 200px කියලා අනිවාර්යයෙන්ම දෙන්න */}
  <div style={{ width: '100%', height: '200px' }}> 
    {chartData && chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expenses" fill="#f87171" />
          <Bar dataKey="earnings" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-full flex items-center justify-center text-gray-400">
        No Data!
      </div>
    )}
  </div>
</div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border p-5 shadow-xs">
              <h4 className="text-sm font-bold mb-3">Weather Today</h4>
              <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{weather.temp}°C</h2>
                    <p className="text-xs font-semibold text-gray-500 capitalize">{weather.description}</p>
                </div>
                <span className="text-5xl">⛅</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-xs">
  <h4 className="text-sm font-bold mb-3">Recent Harvests</h4>
  <div className="flex flex-col gap-3">
    {dashboardData.recentHarvests && dashboardData.recentHarvests.length > 0 ? (
      dashboardData.recentHarvests.map((h: any, index: number) => (
        <div key={h._id || index} className="flex justify-between">
          <span>🌾 Crop: {h.cropName || "N/A"}</span> 
          <span className="bg-green-50 text-green-700 px-2 rounded-lg text-xs font-bold">
            {h.quantity} kg
          </span>
        </div>
      ))
    ) : (
      <p className="text-xs text-gray-400">No recent harvests found.</p>
    )}
  </div>
</div>
           <div className="bg-white rounded-2xl border p-5 shadow-xs flex flex-col h-64">
  <h4 className="text-sm font-bold mb-3">AI Assistant Chat</h4>
  <div className="flex-1 overflow-y-auto mb-3 space-y-2">
    {messages.map((m, i) => (
      <p key={i} className={`text-xs p-2 rounded ${m.sender === 'bot' ? 'bg-gray-100' : 'bg-green-100 text-right'}`}>
        {m.text}
      </p>
    ))}
  </div>
  <div className="flex gap-2">
    <input 
      value={input} 
      onChange={(e) => setInput(e.target.value)}
      className="border rounded px-2 text-xs w-full" 
      placeholder="Ask Question..." 
    />
    <button onClick={handleSend} className="bg-green-700 text-white px-3 py-1 rounded text-xs">Send</button>
  </div>
</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;