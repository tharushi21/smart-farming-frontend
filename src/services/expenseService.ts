import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// Admin සඳහා
export const fetchAllExpenses = () => axios.get(`${API_URL}/admin/all`, getAuthHeaders());

// Farmer සඳහා (userId හරහා)
export const fetchUserExpenses = (userId: string) => axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());

// පොදු මෙහෙයුම් (Create, Update, Delete)
export const addExpense = (data: any) => {
    // Backend එකේ route එක "/" නම්, මෙහි "/api/expenses/" ලෙස යවන්න
    return axios.post('http://localhost:5000/api/expenses/', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
};export const updateExpense = (id: string, data: any) => axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
export const deleteExpense = (id: string) => axios.delete(`${API_URL}/${id}`, getAuthHeaders());