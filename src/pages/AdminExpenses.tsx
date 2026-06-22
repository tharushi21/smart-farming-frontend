import React, { useState, useEffect } from "react";
import { fetchAllExpenses, deleteExpense, addExpense, updateExpense } from "../services/expenseService";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminExpenses: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", amount: "", category: "", date: "", userId: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadExpenses = async () => {
    try {
      const res = await fetchAllExpenses();
      setExpenses(res.data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  useEffect(() => { const fetchData = async () => { try { const res = await fetchAllExpenses(); setExpenses(res.data); } catch (error) { console.error(error); } }; fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        setExpenses(expenses.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed! Check Backend.");
      }
    }
  };

  const openEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({ 
      title: exp.title, 
      amount: exp.amount.toString(), 
      category: exp.category, 
      date: exp.date ? exp.date.substring(0, 10) : "", 
      userId: exp.user?.id || "" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, formData);
      } else {
        await addExpense(formData);
      }
      setIsModalOpen(false);
      loadExpenses();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Operation failed! Check console for backend details.");
    }
  };

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  }).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const totalFarmers = new Set(expenses.map(exp => exp.user?.id)).size;

  const categoryTotals = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ["#064e3b", "#3b82f6", "#f59e0b", "#d946ef", "#f97316", "#9ca3af"],
    }],
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
            onClick={() => navigate("/admin/crops")} 
            className="p-3 hover:bg-green-700 rounded-lg text-left transition"
        >
            Manage All Crops
        </button>
        
        <button 
            onClick={() => navigate("/admin/expenses")} 
            className="p-3 bg-green-700 rounded-lg text-left font-bold transition"
        >
            Manage Expenses
        </button>
    </nav>
</aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <button onClick={() => { setEditingId(null); setFormData({ title: "", amount: "", category: "", date: "", userId: "" }); setIsModalOpen(true); }} className="bg-[#064e3b] text-white px-6 py-2 rounded-lg font-bold">+ Add Expense</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <h2 className="text-2xl font-bold mt-2">LKR {totalExpenses.toLocaleString()}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-gray-500 text-sm">This Month</p>
                <h2 className="text-2xl font-bold mt-2">LKR {thisMonthExpenses.toLocaleString()}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-gray-500 text-sm">Total Farmers</p>
                <h2 className="text-2xl font-bold mt-2">{totalFarmers}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-gray-500 text-sm">Categories</p>
                <h2 className="text-2xl font-bold mt-2">{Object.keys(categoryTotals).length}</h2>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 h-[300px] w-full max-w-[400px]">
             <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr><th className="p-4">Date</th><th className="p-4">Farmer</th><th className="p-4">Category</th><th className="p-4">Item</th><th className="p-4">Amount</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody>
              {expenses.map((exp: any) => (
                <tr key={exp._id} className="border-b">
                  <td className="p-4">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-4">{exp.user?.name || "N/A"}</td>
                  <td className="p-4">{exp.category}</td>
                  <td className="p-4">{exp.title}</td>
                  <td className="p-4">LKR {exp.amount.toLocaleString()}</td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => openEdit(exp)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDelete(exp._id)} className="text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-[400px]">
                <h2 className="font-bold text-lg mb-4">{editingId ? "Edit Expense" : "Add New Expense"}</h2>
                <input className="w-full border p-2 mb-2 rounded" placeholder="Item Name" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input className="w-full border p-2 mb-2 rounded" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                <input className="w-full border p-2 mb-2 rounded" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                <input className="w-full border p-2 mb-4 rounded" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                <div className="flex gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-[#064e3b] text-white rounded">Save</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default AdminExpenses;