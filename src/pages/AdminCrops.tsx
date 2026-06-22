import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCrops: React.FC = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);

  // දත්ත ලබාගැනීම
  useEffect(() => {
    const fetchAllCrops = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/crops", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCrops(res.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchAllCrops();
  }, []);

  // DELETE ක්‍රියාවලිය
 // AdminCrops.tsx
const handleDelete = async (id: string) => {
  console.log("Deleting ID:", id); // මේක Console එකේ පේනවද බලන්න
  if (window.confirm("Are you sure?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/crops/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops(crops.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error); // මෙතන error එක මොකක්ද කියලා මට කියන්න
    }
  }
};

  // UPDATE ක්‍රියාවලිය
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/crops/${selectedCrop._id}`, selectedCrop, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops(crops.map(c => c._id === selectedCrop._id ? res.data : c));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to update crop!");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
        <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between p-5">
            <div>
                <h2 className="text-xl font-bold mb-10">
                    🌿 Smart Farming
                    <span className="block text-sm font-normal text-green-300">Admin Panel</span>
                </h2>

                <nav className="flex flex-col gap-2">
                    <button onClick={() => navigate("/admin-dashboard")} className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50">
                        📊 Dashboard
                    </button>
                    
                    {/* අලුතින් එකතු කළ බොත්තම */}
                    <button onClick={() => navigate("/admin/crops")} className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50">
                        🌱 Manage All Crops
                    </button>

                    <button onClick={() => navigate("/admin/users")} className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50">
                        👥 Users
                    </button>

                    <button onClick={() => navigate("/admin/expenses")} className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50">
                        💰 Expenses
                    </button>

                    <button onClick={() => navigate("/admin/harvests")} className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50">
                        🌾 Harvests
                    </button>

                    <button onClick={() => navigate("/admin/settings")} className="bg-[#0f766e] px-4 py-3 rounded-xl text-left font-medium">
                        ⚙️ Settings
                    </button>
                </nav>
            </div>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition"
            >
                Logout
            </button>
        </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage All Crop Records</h1>
            {/* ADD CROP බොත්තම */}
            <button className="bg-[#064e3b] text-white px-4 py-2 rounded-lg font-bold">
                + Register New Crop
            </button>
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-sm">
                <th className="p-4">CROP NAME</th>
                <th className="p-4">FARMER</th>
                <th className="p-4">AREA</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id} className="border-b text-sm text-gray-600">
                  <td className="p-4">{crop.name}</td>
                  <td className="p-4">{crop.user?.name || "N/A"}</td>
                  <td className="p-4">{crop.landSize} Acres</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                       {crop.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setSelectedCrop(crop); setIsEditModalOpen(true); }} className="text-blue-600 font-bold text-xs">Edit</button>
                    <button onClick={() => handleDelete(crop._id)} className="text-red-500 font-bold text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* EDIT MODAL එක */}
      {isEditModalOpen && selectedCrop && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <form onSubmit={handleUpdate} className="bg-white p-6 rounded-2xl w-[400px]">
                <h3 className="font-bold text-lg mb-4">Edit Crop Status</h3>
                <input className="w-full border p-2 mb-2 rounded" value={selectedCrop.name} onChange={(e) => setSelectedCrop({...selectedCrop, name: e.target.value})} />
                <select className="w-full border p-2 mb-4 rounded" value={selectedCrop.status} onChange={(e) => setSelectedCrop({...selectedCrop, status: e.target.value})}>
                    <option value="PLANTED">PLANTED</option>
                    <option value="GROWING">GROWING</option>
                    <option value="HARVESTED">HARVESTED</option>
                </select>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Changes</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default AdminCrops;