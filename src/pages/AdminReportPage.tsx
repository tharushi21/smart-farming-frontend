import React from "react";
import { useNavigate } from "react-router-dom";

const AdminReportPage: React.FC = () => {
    const navigate = useNavigate();

    const reportCards = [
        { title: "Crop Report", icon: "🌱", link: "/admin/reports/crops" },
        { title: "Expense Report", icon: "💰", link: "/admin/reports/expenses" },
        { title: "Harvest Report", icon: "🌾", link: "/admin/reports/harvests" },
        { title: "Income Report", icon: "📈", link: "/admin/reports/income" },
        { title: "Farmer Report", icon: "👨‍🌾", link: "/admin/reports/farmers" },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
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
            onClick={() => navigate("/admin/reports")} 
            className="p-3 bg-green-700 rounded-lg text-left font-bold transition"
        >
            Reports
        </button>
    </nav>
</aside>

            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-8">Reports Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCards.map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition cursor-pointer" 
                             onClick={() => navigate(card.link)}>
                            <div className="text-4xl mb-4">{card.icon}</div>
                            <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
                            <p className="text-gray-400 text-sm mt-2">Click to view detailed report</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminReportPage;