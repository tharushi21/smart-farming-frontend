import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const IncomeReportPage: React.FC = () => {
    const navigate = useNavigate();
    const [incomeData, setIncomeData] = useState<any[]>([]);

    useEffect(() => {
        const fetchIncome = async () => {
            try {
               const res = await api.get(
  "/reports/income",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
                setIncomeData(res.data);
            } catch (error) { console.error("Error:", error); }
        };
        fetchIncome();
    }, []);

    // මෙතැනදී තමයි reduce() භාවිතා කරන්නේ
    const totalIncome = incomeData.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate("/admin/reports")} 
                className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Back to Reports
            </button>
            <h1 className="text-2xl font-bold mb-6">Income Report</h1>
            <div className="bg-white p-8 rounded-2xl shadow border">
                <h2 className="text-gray-500 mb-2">Total Accumulated Income</h2>
                <p className="text-4xl font-bold text-green-700">LKR {totalIncome.toLocaleString()}</p>
            </div>
            {/* මෙහි ඔබට අවශ්‍ය නම් Table එකක් දාන්න පුළුවන් */}
        </div>
    );
};

export default IncomeReportPage;