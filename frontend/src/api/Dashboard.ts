import axios from "axios";

export const fetchSummaryData = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/summary`
  );
  return data.data;
};

export const fetchRecentBookings = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/recentBookings`
  );
  console.log("dasa", data.data);
  return data.data;
};

export const fetchLatesReviews = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/recentReviews`
  );
  return data;
};

export const fetchPopularPackages = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/getTopPackages`
  );
  return data;
};

export const fetchGlobalSearch = async (query: string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/globalSearch?q=${encodeURIComponent(query)}`
  );
  return data.data;
};

export const fetchMonthlyRevenue = async (): Promise<{
  success: boolean;
  data: { month: number; totalRevenue: number; totalBookings: number }[];
}> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/monthly-stats`
  );
  return data.data;
};