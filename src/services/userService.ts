import { api } from "./api";

export const fetchAllUsers = () => api.get("/users");
export const createUser = (userData: any) => api.post("/users/add", userData);