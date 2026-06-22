import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@smartfarming.com",
  });

  const [notifications, setNotifications] = useState({
    weather: true,
    harvest: true,
    users: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between p-5">
        <div>
          <h2 className="text-xl font-bold mb-10">
            🌿 Smart Farming
            <span className="block text-sm font-normal text-green-300">
              Admin Panel
            </span>
          </h2>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50"
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50"
            >
              👥 Users
            </button>

            <button
              onClick={() => navigate("/admin/crops")}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50"
            >
              🌱 Crops
            </button>

            <button
              onClick={() => navigate("/admin/expenses")}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50"
            >
              💰 Expenses
            </button>

            <button
              onClick={() => navigate("/admin/harvests")}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#0f766e]/50"
            >
              🌾 Harvests
            </button>

            <button className="bg-[#0f766e] px-4 py-3 rounded-xl text-left font-medium">
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ⚙️ Admin Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account and system preferences
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-5">
              👤 Profile Information
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border rounded-xl p-3"
                placeholder="Name"
              />

              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full border rounded-xl p-3"
                placeholder="Email"
              />

              <button className="bg-[#064e3b] text-white px-6 py-3 rounded-xl">
                Save Profile
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-5">
              🔐 Change Password
            </h2>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border rounded-xl p-3"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full border rounded-xl p-3"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded-xl p-3"
              />

              <button className="bg-[#064e3b] text-white px-6 py-3 rounded-xl">
                Update Password
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-5">
              🔔 Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Weather Alerts</span>
                <input
                  type="checkbox"
                  checked={notifications.weather}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      weather: !notifications.weather,
                    })
                  }
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Harvest Alerts</span>
                <input
                  type="checkbox"
                  checked={notifications.harvest}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      harvest: !notifications.harvest,
                    })
                  }
                />
              </div>

              <div className="flex justify-between items-center">
                <span>New User Registration</span>
                <input
                  type="checkbox"
                  checked={notifications.users}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      users: !notifications.users,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-5">
              🌍 System Information
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>System Name</span>
                <span className="font-semibold">
                  Smart Farming Management System
                </span>
              </div>

              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-semibold">v1.0.0</span>
              </div>

              <div className="flex justify-between">
                <span>Environment</span>
                <span className="font-semibold text-green-600">
                  Production
                </span>
              </div>

              <div className="flex justify-between">
                <span>Database</span>
                <span className="font-semibold">
                  MongoDB Atlas
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;