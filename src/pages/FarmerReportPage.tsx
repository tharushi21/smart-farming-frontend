import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerReportPage: React.FC = () => {
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/reports/farmers", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => setFarmers(res.data));
    }, []);

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate("/admin/reports")} 
                className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Back to Reports
            </button>
            <h1 className="text-2xl font-bold mb-6">Farmer Report</h1>
            <table className="w-full bg-white shadow rounded-xl">
                <thead className="bg-gray-100"><tr><th className="p-4">Farmer Name</th><th className="p-4">Email</th></tr></thead>
                <tbody>
                    {farmers.map((f: any) => <tr key={f._id} className="border-t"><td className="p-4">{f.name}</td><td className="p-4">{f.email}</td></tr>)}
                </tbody>
            </table>
        </div>
    );
};
export default FarmerReportPage;