import axios from "axios";

const API_URL = "http://localhost:5000/api/harvests";

export const getHarvestsByCrop = async (cropId: string, token: string) => {
  const response = await axios.get(`${API_URL}/crop/${cropId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createHarvest = async (harvestData: any, token: string) => {
  const response = await axios.post(`${API_URL}/add`, harvestData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};