import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCrops, addCrop, deleteCrop, updateCrop } from "../services/cropService";

const Crops: React.FC = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [landSize, setLandSize] = useState("");
  const [plantedDate, setPlantedDate] = useState("");
  const [status, setStatus] = useState("PLANTED");

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await fetchCrops();
        setCrops(data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    loadCrops();
  }, []);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !variety || !landSize || !plantedDate) return;

    try {
      const newCrop = await addCrop({ 
        name, 
        variety, 
        landSize: parseFloat(landSize), 
        plantedDate, 
        status 
      });
      setCrops([newCrop, ...crops]);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCrop(id);
      setCrops(crops.filter((crop) => crop._id !== id));
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  };

  const openEditModal = (crop: any) => {
    setSelectedId(crop._id);
    setName(crop.name);
    setVariety(crop.variety);
    setLandSize(crop.landSize ? crop.landSize.toString() : "");
    setPlantedDate(crop.plantedDate ? crop.plantedDate.substring(0, 10) : "");
    setStatus(crop.status);
    setIsEditModalOpen(true);
  };

  const handleUpdateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    try {
      const updatedData = { name, variety, landSize: parseFloat(landSize), plantedDate, status };
      const updatedCrop = await updateCrop(selectedId, updatedData);
      setCrops(crops.map((crop) => (crop._id === selectedId ? updatedCrop : crop)));
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating crop:", error);
    }
  };

  const resetForm = () => {
    setSelectedId(null);
    setName("");
    setVariety("");
    setLandSize("");
    setPlantedDate("");
    setStatus("PLANTED");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
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
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Manage Crops 🌾</h1>
        </header>

        <main className="p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Crop Plantation Registry</h2>
              <p className="text-sm text-gray-500">Track and monitor your farm crops status.</p>
            </div>
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#064e3b] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#042f24] cursor-pointer shadow-xs">+ Register New Crop</button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/50">
                    <th className="p-3">Crop Name</th>
                    <th className="p-3">Variety</th>
                    <th className="p-3">Planted Area</th>
                    <th className="p-3">Planted Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-gray-700">
                  {crops.map((crop) => (
                    <tr key={crop._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-gray-900">{crop.name}</td>
                      <td className="p-3 text-gray-600">{crop.variety}</td>
                      <td className="p-3 text-gray-500">{crop.landSize} Acres</td>
                      <td className="p-3 text-gray-500">{crop.plantedDate ? crop.plantedDate.substring(0, 10) : "N/A"}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${crop.status === "GROWING" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{crop.status}</span>
                      </td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button onClick={() => navigate(`/harvests/${crop._id}`)} className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-xs hover:bg-green-700 cursor-pointer">View Harvest</button>
                        <button onClick={() => openEditModal(crop)} className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer">Edit</button>
                        <button onClick={() => handleDelete(crop._id)} className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 font-bold text-lg">✕</button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Register New Crop</h3>
            <form onSubmit={handleAddCrop} className="flex flex-col gap-4 text-black">
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Crop Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Tomato" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Variety</label>
              <input type="text" value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g., Padma" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Area (Acres)</label>
              <input type="number" step="0.1" value={landSize} onChange={(e) => setLandSize(e.target.value)} placeholder="e.g., 1.5" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Planting Date</label>
              <input type="date" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <button type="submit" className="w-full bg-[#064e3b] text-white font-bold p-3 rounded-xl">Register Crop</button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 font-bold text-lg">✕</button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Edit Crop Status</h3>
            <form onSubmit={handleUpdateCrop} className="flex flex-col gap-4 text-black">
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Crop Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Variety</label>
              <input type="text" value={variety} onChange={(e) => setVariety(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Area (Acres)</label>
              <input type="number" step="0.1" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Planting Date</label>
              <input type="date" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="PLANTED">PLANTED</option>
                <option value="GROWING">GROWING</option>
                <option value="HARVESTED">HARVESTED</option>
              </select></div>
              <button type="submit" className="w-full bg-[#0f766e] text-white font-bold p-3 rounded-xl">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crops;