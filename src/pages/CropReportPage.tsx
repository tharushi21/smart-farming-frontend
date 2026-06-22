import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CropReportPage: React.FC = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/reports/crops", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => setCrops(res.data));
    }, []);

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate("/admin/reports")} 
                className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Back to Reports
            </button>
            <h1 className="text-2xl font-bold mb-6">Crop Report</h1>
            <table className="w-full bg-white shadow rounded-xl">
                <thead className="bg-gray-100"><tr><th className="p-4">Crop Name</th><th className="p-4">Total Harvested (kg)</th></tr></thead>
                <tbody>
                    {crops.map((c: any) => <tr key={c._id} className="border-t"><td className="p-4">{c.name}</td><td className="p-4">{c.totalQty}</td></tr>)}
                </tbody>
            </table>
        </div>
    );
};
export default CropReportPage;