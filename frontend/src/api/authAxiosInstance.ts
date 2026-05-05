import axios from "axios";

// Separate axios instance for authentication using Musafir backend
const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MUSAFIR_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
});

export default authAxiosInstance;
