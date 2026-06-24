import React, { useState, useEffect } from "react";
// import axios from "axios";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminHarvestPage: React.FC = () => {
    const navigate = useNavigate();
    const [harvests, setHarvests] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCrop, setFilterCrop] = useState("All");
    const [selectedHarvest, setSelectedHarvest] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ quantity: "", sellingPrice: "", date: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    const loadHarvests = async () => {
        try {
            const res = await api.get(
  "/harvests/admin/all",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
            setHarvests(res.data);
        } catch (error) { console.error("Error loading harvests:", error); }
    };

    useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/harvests/admin/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setHarvests(res.data);
    } catch (error) {
      console.error("Error loading harvests:", error);
    }
  };

  fetchData();
}, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this harvest record?")) {
            try {
               await api.delete(
  `/harvests/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
                loadHarvests();
            } catch (error) {
                console.error("Delete error:", error);
                 alert("Delete failed!"); }
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(
  `/harvests/${editingId}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
            setIsEditModalOpen(false);
            loadHarvests();
        } catch (error) { 
            console.error("Delete error:", error);
            alert("Update failed!"); }
    };

    const filteredHarvests = harvests.filter(h => 
        (filterCrop === "All" || h.crop?.name === filterCrop) &&
        (h.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Harvest Report", 14, 15);
        autoTable(doc, {
            head: [['Farmer', 'Crop', 'Quantity (kg)', 'Earnings (LKR)']],
            body: filteredHarvests.map(h => [h.user?.name, h.crop?.name, h.quantity, h.sellingPrice]),
        });
        doc.save("Harvest_Report.pdf");
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredHarvests.map(h => ({
            Farmer: h.user?.name,
            Crop: h.crop?.name,
            Quantity_kg: h.quantity,
            Earnings_LKR: h.sellingPrice
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Harvests");
        XLSX.writeFile(workbook, "Harvest_Report.xlsx");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-[#064e3b] text-white p-5 flex flex-col min-h-screen">
    <h2 className="text-xl font-bold mb-8">Admin Portal</h2>
    
    <nav className="flex flex-col gap-2">
        <button 
            onClick={() => navigate("/admin-dashboard")} 
            className="p-3 hover:bg-green-700 rounded-lg text-left transition"
        >
            Dashboard
        </button>
        
        <button 
            onClick={() => navigate("/admin/expenses")} 
            className="p-3 hover:bg-green-700 rounded-lg text-left transition"
        >
            Manage Expenses
        </button>
        
        <button 
            onClick={() => navigate("/admin/harvests")} 
            className="p-3 bg-green-700 rounded-lg text-left font-bold transition"
        >
            Manage Harvests
        </button>
    </nav>
</aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Harvest Management</h1>
                
                <div className="flex gap-4 mb-6">
                    <input type="text" placeholder="Search Farmer..." className="p-2 border rounded" onChange={(e) => setSearchTerm(e.target.value)} />
                    <select className="p-2 border rounded" onChange={(e) => setFilterCrop(e.target.value)}>
                        <option value="All">All Crops</option>
                        <option value="Rice">Rice</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Beans">Beans</option>
                    </select>
                    <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded font-semibold">Export PDF</button>
                    <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Export Excel</button>
                </div>

                <table className="w-full bg-white rounded-xl shadow">
                    <thead className="bg-gray-100 uppercase text-xs text-gray-500">
                        <tr><th className="p-4">Farmer</th><th className="p-4">Crop</th><th className="p-4">Quantity</th><th className="p-4">Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredHarvests.map((h: any) => (
                            <tr key={h._id} className="border-t">
                                <td className="p-4">{h.user?.name}</td>
                                <td className="p-4">{h.crop?.name}</td>
                                <td className="p-4">{h.quantity} kg</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => setSelectedHarvest(h)} className="text-gray-600">👁️</button>
                                    <button onClick={() => { setEditingId(h._id); setFormData({quantity: h.quantity, sellingPrice: h.sellingPrice, date: h.date?.substring(0,10)}); setIsEditModalOpen(true); }} className="text-blue-600">✏️</button>
                                    <button onClick={() => handleDelete(h._id)} className="text-red-500">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl w-[400px]">
                        <h2 className="font-bold mb-4">Edit Harvest</h2>
                        <input className="w-full border p-2 mb-2 rounded" type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                        <input className="w-full border p-2 mb-2 rounded" type="number" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
                        <input className="w-full border p-2 mb-4 rounded" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-200 rounded">Cancel</button>
                            <button type="submit" className="flex-1 py-2 bg-[#064e3b] text-white rounded">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {selectedHarvest && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-[400px]">
                        <h2 className="font-bold mb-4">Harvest Details</h2>
                        <p><strong>Farmer:</strong> {selectedHarvest.user?.name}</p>
                        <p><strong>Crop:</strong> {selectedHarvest.crop?.name}</p>
                        <p><strong>Quantity:</strong> {selectedHarvest.quantity} kg</p>
                        <p><strong>Price:</strong> LKR {selectedHarvest.sellingPrice}</p>
                        <button onClick={() => setSelectedHarvest(null)} className="w-full bg-gray-500 text-white py-2 mt-4 rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHarvestPage;