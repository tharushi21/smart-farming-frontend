import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ExpenseItem {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}
const COLORS = ['#064e3b', '#2563eb', '#fbbf24', '#a855f7', '#6b7280'];
const data = [
  { name: 'Fertilizer', value: 40 },
  { name: 'Seeds', value: 25 },
  { name: 'Pesticides', value: 15 },
  { name: 'Labor', value: 10 },
  { name: 'Others', value: 10 },
];


const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Modals open/close states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form States
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Fertilizer");
  const [date, setDate] = useState("");

  // 🚨 [වැදගත්]: Login වෙද්දී localStorage එකට දාපු userId එක මෙතනින් ගන්නවා
  // (ඔයා Login එකේදී localStorage.setItem("userId", user._id) වගේ දාලා තියෙන්න ඕනේ)
  const userId = localStorage.getItem("userId") || "660d1234567890abcdef1234"; 

  // 🌟 1. Database එකෙන් Expenses කියවීම (GET)
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        // 🚨 Backend එකේ router.get("/user/:userId", getExpenses) එකට හරියටම මැච් කළා
        const response = await axios.get(`http://localhost:5000/api/expenses/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setExpenses(response.data); 
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (userId) fetchExpenses();
  }, [userId]);

  // 🌟 2. අලුත් Expense එකක් Database එකටම සේව් කිරීම (POST)
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    try {
      const token = localStorage.getItem("token");
      const expenseData = {
        title,
        amount: parseFloat(amount),
        category,
        date,
        userId // 🚨 Backend එකේ req.body එකෙන් userId එක බලාපොරොත්තු වන නිසා මෙතනින් යැව්වා
      };

      // 🚨 Backend router.post("/add", createExpense) එකට මැච් කළා
      const response = await axios.post("http://localhost:5000/api/expenses/", expenseData, {
       headers: { Authorization: `Bearer ${token}` }
   });
    

      setExpenses([response.data, ...expenses]);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // 🌟 3. Expense එකක් Database එකෙන් මැකීම (DELETE)
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      
      // 🚨 Backend router.delete("/delete/:id", deleteExpense) එකට මැච් කළා
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const openEditModal = (exp: ExpenseItem) => {
    setSelectedId(exp._id);
    setTitle(exp.title);
    setAmount(exp.amount.toString());
    setCategory(exp.category);
    setDate(exp.date ? exp.date.substring(0, 10) : "");
    setIsEditModalOpen(true);
  };

  // 🌟 4. වෙනස් කරපු දත්ත Database එකේ Update කිරීම (PUT)
  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        title,
        amount: parseFloat(amount),
        category,
        date,
      };

      // 🚨 Backend router.put("/update/:id", updateExpense) එකට මැච් කළා
      const response = await axios.put(`http://localhost:5000/api/expenses/${selectedId}`, updatedData, {
  headers: { Authorization: `Bearer ${token}` }
});

      setExpenses(expenses.map((exp) => (exp._id === selectedId ? response.data : exp)));
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setAmount("");
    setCategory("Fertilizer");
    setDate("");
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
        <div className="flex items-center justify-between bg-[#042f24] p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-xl font-bold">T</div>
            <div>
              <h4 className="text-sm font-bold">Tharushi</h4>
              <p className="text-xs text-green-400">Farmer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Financial Insights 💰</h1>
        </header>

        <main className="p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Crop Expenses</h2>
              <p className="text-sm text-gray-500">Detailed financial ledger for the current farming cycle.</p>
            </div>
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#064e3b] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#042f24] cursor-pointer shadow-xs">+ Add New Expense</button>
          </div>
              <div className="flex gap-6 mb-6">
  {/* Total Expenses Card */}
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-64">
    <p className="text-red-500 text-sm font-medium">Total Expenses</p>
    <h2 className="text-3xl font-bold mt-1">LKR 45,250</h2>
    <p className="text-green-700 text-sm mt-2 font-medium">This Month</p>
  </div>

  {/* Chart Section */}
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex items-center justify-between">
    <div className="h-40 w-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-col gap-2">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
          <span className="w-24 text-gray-600">{item.name}</span>
          <span className="font-bold">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
</div>
          {/* Expenses Table */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase bg-gray-50/50">
                    <th className="p-3">Expense Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-gray-700">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">No expenses found!</td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-800">{exp.title}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{exp.category}</span>
                        </td>
                        <td className="p-3 font-bold text-gray-900">Rs. {exp.amount.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{exp.date ? exp.date.substring(0, 10) : "N/A"}</td>
                        <td className="p-3 text-center flex justify-center gap-3">
                          <button onClick={() => openEditModal(exp)} className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer">Remove</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl relative text-black">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 font-bold text-lg cursor-pointer">✕</button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Add New Expense 🌾</h3>
            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Expense Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Fertilizer" className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Amount (Rs.)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 5000" className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none cursor-pointer">
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Tools">Tools/Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none cursor-pointer" required />
              </div>
              <button type="submit" className="w-full bg-[#064e3b] text-white font-bold p-3 rounded-xl mt-2">Save Expense</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EXPENSE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl relative text-black">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 font-bold text-lg cursor-pointer">✕</button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Edit Expense Details ✏️</h3>
            <form onSubmit={handleUpdateExpense} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Expense Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Amount (Rs.)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none cursor-pointer">
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Tools">Tools/Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none cursor-pointer" required />
              </div>
              <button type="submit" className="w-full bg-[#0f766e] text-white font-bold p-3 rounded-xl mt-2">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;