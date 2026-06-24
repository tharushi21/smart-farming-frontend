import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users as UsersIcon } from 'lucide-react';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Farmer", status: "Active" });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) { console.error("Error fetching users:", err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
  "/users/add",
  formData
);
      fetchUsers();
      setIsModalOpen(false);
      setFormData({ name: "", email: "", role: "Farmer", status: "Active" });
    } catch (err) { console.error("Error adding user:", err); }
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(
  `/users/update/${selectedUser._id}`,
  formData
);
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) { console.error("Error updating user:", err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
       await api.delete(
  `/users/delete/${id}`
);
        fetchUsers();
      } catch (err) { console.error("Error deleting user:", err); }
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'view', user: any = null) => {
    setModalMode(mode);
    if (user) {
      setFormData(user);
      setSelectedUser(user);
    } else {
      setFormData({ name: "", email: "", role: "Farmer", status: "Active" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#064e3b] text-white p-5">
        <h2 className="text-xl font-bold mb-8">Smart Farming</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate("/admin-dashboard")} className="flex items-center gap-3 p-3 hover:bg-green-700 rounded-lg"><LayoutDashboard size={20}/> Dashboard</button>
          <button className="flex items-center gap-3 p-3 bg-green-700 rounded-lg"><UsersIcon size={20}/> Users</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <button onClick={() => openModal('add')} className="bg-[#064e3b] text-white px-4 py-2 rounded-lg font-bold">+ Add User</button>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b text-gray-400 text-sm">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3 text-gray-500">
                    <button onClick={() => openModal('view', user)}>👁️</button>
                    <button onClick={() => openModal('edit', user)}>✏️</button>
                    <button onClick={() => handleDelete(user._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form onSubmit={handleAddUser} className="bg-white p-6 rounded-xl w-96 flex flex-col gap-4">
            <h2 className="text-xl font-bold capitalize">{modalMode} User</h2>
            <input disabled={modalMode === 'view'} type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border p-2 rounded" />
            <input disabled={modalMode === 'view'} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded" />
            
            {modalMode !== 'view' && (
              <button type="button" onClick={modalMode === 'add' ? handleAddUser : handleUpdateUser} className="bg-[#064e3b] text-white p-2 rounded">
                {modalMode === 'add' ? 'Save' : 'Update'}
              </button>
            )}
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 p-2 rounded">Close</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;