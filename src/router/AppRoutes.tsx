import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Crops from "../pages/Crops";
import Expenses from "../pages/Expenses";
import Harvests from "../pages/Harvests";
import AIAssistantPage from "../pages/AiAssistant";
import WeatherPage from "../pages/Weather";
import ReportsPage from "../pages/Reports";
import AdminDashboard from "../pages/AdminDashboard";
import Users from "../pages/Users";
import AdminCrops from "../pages/AdminCrops";
import AdminExpenses from "../pages/AdminExpenses";
import AdminHarvestPage from "../pages/AdminHarvestPage";
import AdminWeatherPage from "../pages/AdminWeatherPage";
import AdminReportPage from "../pages/AdminReportPage";
import SettingsPage from "../pages/SettingsPage"; // මෙතනට ඔයාගේ SettingsPage එක import කරන්න
import CropReportPage from "../pages/CropReportPage";
import ExpenseReportPage from "../pages/ExpenseReportPage";
import HarvestReportPage from "../pages/HarvestReportPage";
import IncomeReportPage from "../pages/IncomeReportPage";
import FarmerReportPage from "../pages/FarmerReportPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crops" element={<Crops />} />          
        <Route path="/expenses" element={<Expenses />} />  
        <Route path="/harvests/:cropId" element={<Harvests />} />   
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/crops" element={<AdminCrops />} />
        <Route path="/users" element={<Users />} />
        <Route path="/admin/expenses" element={<AdminExpenses />} />
        <Route path="/admin/harvests" element={<AdminHarvestPage />} />
        <Route path="/admin/weather" element={<AdminWeatherPage />} />
        <Route path="/admin/reports" element={<AdminReportPage />} />
        
        {/* Settings Route */}
        <Route path="/admin/settings" element={<SettingsPage />} />

        {/* Report Detail Routes */}
        <Route path="/admin/reports/crops" element={<CropReportPage />} />
        <Route path="/admin/reports/expenses" element={<ExpenseReportPage />} />
        <Route path="/admin/reports/harvests" element={<HarvestReportPage />} />
        <Route path="/admin/reports/income" element={<IncomeReportPage />} />
        <Route path="/admin/reports/farmers" element={<FarmerReportPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;