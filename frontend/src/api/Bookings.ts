import axios from "axios";

export const fetchALLBookings = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/booking`
  );
  return data.data;
};

export const fetchBookingById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/booking/${id}`
  );
  return data.data;
};

export const fetchBookingByPackageName = async (packageName:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/booking/package/${packageName}`
  );
  return data.data;
};

export const fetchBookingByCustomerName = async (username:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/booking/package/${username}`
  );
  return data.data;
};

export const fetchBookingRevenue = async (): Promise<{
  success: boolean;
  data: { month: number; totalRevenue: number }[];
}> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/booking/revenue`
  );
  return data.data;
};