// import axios from "axios";
// import { ReportSummary } from "../types/Report";

// const API_URL = "http://localhost:5000/api/reports";

// export const getReportSummary = async (): Promise<ReportSummary> => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(`${API_URL}/summary`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };