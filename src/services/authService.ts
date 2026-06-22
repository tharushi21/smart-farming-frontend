import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData: Record<string, unknown>) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData: Record<string, unknown>) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    // user ව object එකක් විදියට save කරන එක හොඳයි
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  
  // මෙතනින් මුළු response.data එකම return වෙනවා, 
  // ඒකේ token සහ user කියන දෙකම තියෙනවා.
  return response.data; 
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role"); // role එකත් අයින් කරන්න
};