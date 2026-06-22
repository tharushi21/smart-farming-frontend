import api from "./api"; // ඔයාගේ axios instance එක

export const fetchAllUsers = () => api.get("/users");
export const createUser = (userData: any) => api.post("/users/add", userData);