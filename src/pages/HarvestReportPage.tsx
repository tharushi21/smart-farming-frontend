import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HarvestReportPage: React.FC = () => {
    const navigate = useNavigate();
    const [harvests, setHarvests] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/reports/harvests", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => setHarvests(res.data));
    }, []);

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate("/admin/reports")} 
                className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Back to Reports
            </button>
            <h1 className="text-2xl font-bold mb-6">Harvest Report</h1>
            <table className="w-full bg-white shadow rounded-xl">
                <thead className="bg-gray-100"><tr><th className="p-4">Farmer</th><th className="p-4">Crop</th><th className="p-4">Quantity</th></tr></thead>
                <tbody>
                    {harvests.map((h: any) => <tr key={h._id} className="border-t"><td className="p-4">{h.user?.name}</td><td className="p-4">{h.crop?.name}</td><td className="p-4">{h.quantity}</td></tr>)}
                </tbody>
            </table>
        </div>
    );
};
export default HarvestReportPage;