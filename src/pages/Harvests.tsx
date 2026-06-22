import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface HarvestItem {
  _id: string;
  quantity: number;
  sellingPrice: number;
  date: string;
}

const Harvests: React.FC = () => {
  const navigate = useNavigate();
  const { cropId } = useParams<{ cropId: string }>();
  const [harvests, setHarvests] = useState<HarvestItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [date, setDate] = useState("");

  const fetchHarvests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/harvests/crop/${cropId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHarvests(response.data);
    } catch (error) {
      console.error("Error fetching harvests:", error);
    }
  };

  useEffect(() => {
    if (cropId) fetchHarvests();
  }, [cropId]);

  const handleAddHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/harvests/add", {
        crop: cropId,
        quantity: parseFloat(quantity),
        sellingPrice: parseFloat(sellingPrice),
        date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // දත්ත සාර්ථකව එකතු වූ පසු UI එකට අලුත් දත්තය එක් කිරීම
      setHarvests([response.data, ...harvests]);
      
      setIsModalOpen(false);
      setQuantity(""); 
      setSellingPrice(""); 
      setDate("");
    } catch (error) {
      console.error("Error adding harvest:", error);
      alert("දත්ත එකතු කිරීමේදී දෝෂයක් සිදුවිය. නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col p-5 shrink-0">
        <h2 className="text-xl font-bold mb-8">Smart Farming</h2>
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
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Harvest Records 🌾</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-green-700 text-white px-4 py-2 rounded-xl cursor-pointer">+ Add Harvest</button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-xs uppercase">
                <th className="p-3">Quantity (kg)</th>
                <th className="p-3">Selling Price (Rs.)</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {harvests.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400">No records found for this crop.</td></tr>
              ) : (
                harvests.map((h) => (
                  <tr key={h._id} className="border-b">
                    <td className="p-3 font-bold">{h.quantity} kg</td>
                    <td className="p-3">Rs. {h.sellingPrice.toLocaleString()}</td>
                    <td className="p-3">{new Date(h.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl w-[400px]">
            <h3 className="font-bold mb-4">Add Harvest</h3>
            <form onSubmit={handleAddHarvest} className="flex flex-col gap-4">
              <input type="number" placeholder="Quantity (kg)" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded" required />
              <input type="number" placeholder="Selling Price (Rs)" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full p-2 border rounded" required />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" required />
              <button type="submit" className="bg-green-700 text-white p-2 rounded cursor-pointer">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 cursor-pointer">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Harvests;