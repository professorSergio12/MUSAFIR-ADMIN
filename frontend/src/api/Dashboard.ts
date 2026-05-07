import axiosInstance from "./axiosInstance";

export const fetchSummaryData = async (): Promise<any> => {
  const data = await axiosInstance.get("/api/admin/dashboard/summary");
  return data.data;
};

export const fetchRecentBookings = async (): Promise<any> => {
  const data = await axiosInstance.get("/api/admin/dashboard/recentBookings");
  return data.data;
};

export const fetchLatesReviews = async (): Promise<any> => {
  const data = await axiosInstance.get("/api/admin/dashboard/recentReviews");
  return data;
};

export const fetchPopularPackages = async (): Promise<any> => {
  const data = await axiosInstance.get("/api/admin/dashboard/getTopPackages");
  return data.data;
};

export const fetchGlobalSearch = async (query: string): Promise<any> => {
  const data = await axiosInstance.get(
    `/api/admin/dashboard/globalSearch?q=${encodeURIComponent(query)}`,
  );
  return data.data;
};

export const fetchMonthlyRevenue = async (): Promise<{
  success: boolean;
  data: { month: number; totalRevenue: number; totalBookings: number }[];
}> => {
  const data = await axiosInstance.get("/api/admin/dashboard/monthly-stats");
  return data.data;
};
