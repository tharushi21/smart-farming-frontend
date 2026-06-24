import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  wind: number;
  rain: number;
  forecast?: any[];
}

const WeatherPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // මෙතන state එක නිවැරදි කළා
  const [city, setCity] = useState("Anuradhapura");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = (cityName: string) => {
    api.get("/weather/data", {
  params: { city: cityName },
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
    .then(res => setWeather(res.data))
    .catch(err => console.error("Error fetching weather:", err));
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Crops", path: "/crops", icon: "🌱" },
    { name: "Weather", path: "/weather", icon: "☀️" },
    { name: "AI Assistant", path: "/ai-assistant", icon: "🤖" },
    { name: "Reports", path: "/reports", icon: "📊" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
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
        <div className="bg-[#0f766e] p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-bold text-sm">{JSON.parse(localStorage.getItem("user") || "{}").name || "Guest"}</p>
            <p className="text-xs">{JSON.parse(localStorage.getItem("user") || "{}").role || "Farmer"}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Weather</h1>
            <p className="text-gray-500">Real-time weather for {city}</p>
          </div>
          
          {/* Dropdown එක නිවැරදිව සම්බන්ධ කළා */}
          <select 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            className="p-3 bg-white border rounded-xl font-bold text-gray-700 shadow-sm outline-none"
          >
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-blue-100 p-8 rounded-3xl flex justify-between items-center">
            <div>
              <h2 className="text-6xl font-bold">{weather?.temp ?? "..."}°C</h2>
              <p className="text-xl">{weather?.description ?? "Loading..."}</p>
            </div>
            <div className="space-y-3">
              <p>💧 Humidity: {weather?.humidity ?? "0"}%</p>
              <p>💨 Wind Speed: {weather?.wind ?? "0"} km/h</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="font-bold mb-4">5-Day Forecast</h3>
            <div className="flex justify-between text-center">
              {weather?.forecast ? (
                weather.forecast.map((f: any, i: number) => (
                  <div key={i}>
                    <p className="text-xs">{new Date(f.dt_txt).toLocaleDateString('en', {weekday:'short'})}</p>
                    <p className="font-bold">{Math.round(f.main.temp)}°C</p>
                    <p className="text-xs text-blue-500">💧 {f.main.humidity}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[ {l:"Humidity", v: (weather?.humidity ?? "0") + "%"}, {l:"Wind", v: (weather?.wind ?? "0") + " km/h"}, {l:"Rain", v: (weather?.rain ?? "0") + "%"}, {l:"UV Index", v: "6"} ].map((h, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border text-center">
              <p className="text-gray-500 text-sm">{h.l}</p>
              <p className="text-xl font-bold">{h.v}</p>
            </div>
          ))}
        </div>
      {/* Advice */}
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-green-800 text-lg">Farming Advice</h3>
            <p className="text-green-700">Check weather regularly for {city} to plan your irrigation.</p>
          </div>
          <div className="text-4xl">🌱</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;