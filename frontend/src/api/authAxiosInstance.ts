import axios from "axios";

// Admin panel auth: same host as `axiosInstance` unless overridden (`/api/admin/auth/*`)
const authAxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_ADMIN_API_URL ||
    import.meta.env.VITE_MUSAFIR_ADMIN_BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000",
  withCredentials: true,
});

export default authAxiosInstance;
