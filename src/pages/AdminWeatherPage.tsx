import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminWeatherPage: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Anuradhapura");

  const loadWeather = async () => {
    try {
      const res = await api.get(
  `/weather/data?city=${city}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      setWeather(res.data);
    } catch (error) { console.error("Error:", error); }
  };

  useEffect(() => {
  const loadWeather = async () => {
    try {
      const res = await api.get(`/weather/data?city=${city}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setWeather(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadWeather();
}, [city]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - කලින් තිබුණු එකමයි */}
      <aside className="w-64 bg-[#064e3b] text-white p-5 min-h-screen">
    <h2 className="text-xl font-bold mb-8">Admin Portal</h2>
    
    <nav className="flex flex-col gap-2">
        <button 
            onClick={() => navigate("/admin-dashboard")} 
            className="p-3 hover:bg-green-700 rounded-lg text-left transition"
        >
            Dashboard
        </button>
        
        <button 
            onClick={() => navigate("/admin/weather")} 
            className="p-3 bg-green-700 rounded-lg text-left font-bold transition"
        >
            Weather
        </button>
    </nav>
</aside>

      {/* Main Weather Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-1">Weather</h1>
        <p className="text-gray-500 mb-6">Check weather information by district.</p>
        
        <select className="p-2 border rounded mb-6 w-48" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="Anuradhapura">Anuradhapura</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
        </select>

        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Box: Current Weather */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
                {/* Icon එක පෙන්නන තැන */}
<img 
  src={`http://openweathermap.org/img/wn/${weather.forecast[0].weather[0].icon}@2x.png`} 
  alt="weather icon" 
  className="w-20 h-20"
/>
              <h2 className="text-5xl font-bold mb-2">{weather.temp}°C</h2>
              <p className="text-lg text-gray-600 mb-6 capitalize">{weather.description}</p>
              <div className="space-y-4">
                <div className="flex justify-between"><span>Humidity</span> <span className="font-bold">{weather.humidity}%</span></div>
                <div className="flex justify-between"><span>Wind</span> <span className="font-bold">{weather.wind} km/h</span></div>
                <div className="flex justify-between"><span>Rain Chance</span> <span className="font-bold">{weather.rain}%</span></div>
              </div>
            </div>

            {/* Right Box: Forecast */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                
              <h3 className="font-bold text-lg mb-6">5-Day Forecast</h3>
              
              <div className="grid grid-cols-5 gap-4">

                {weather.forecast.slice(0, 5).map((day: any, i: number) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <img 
  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
  alt="forecast icon" 
  className="mx-auto"
/>
                    <p className="text-sm text-gray-500">{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="font-bold text-xl my-2">{Math.round(day.main.temp)}°C</p>
                    <p className="text-xs text-gray-400 capitalize">{day.weather[0].main}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminWeatherPage;