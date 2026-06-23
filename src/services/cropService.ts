// src/services/cropService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/crops";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("No token found in localStorage!");
    return { headers: {} }; 
  }

  return { headers: { Authorization: `Bearer ${token}` } };
};
export const fetchCrops = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const addCrop = async (cropData: any) => {
  const response = await axios.post(API_URL, cropData, getAuthHeaders());
  return response.data;
};

export const updateCrop = async (id: string, cropData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, cropData, getAuthHeaders());
  return response.data;
};

export const deleteCrop = async (id: string) => {
  const token = localStorage.getItem("token");
  await axios.delete(`http://localhost:5000/api/crops/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};