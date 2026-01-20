import axios from "axios";

export const fetchALLHotels = async (page: number = 1): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel?page=${page}`
  );
  return data.data;
};

export const fetchHotelsById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/${id}`
  );
  return data.data;
};

export const fetchHotelsByQuery = async (query : string , value: string, page: number = 1): Promise<any> => {
  try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/query?${query}=${value}&page=${page}`);
    return data.data;
  } catch (error) {
    console.log("failed by Name", error);
    return null;
  }
};

// Lightweight picker endpoint (searchable dropdown)
export const fetchHotelPicker = async (q: string = "", limit: number = 50): Promise<any> => {
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/picker?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    return data.data;
  } catch (error) {
    console.log("failed hotel picker", error);
    return null;
  }
};

export const createHotelAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/create-hotel`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  return data.data;
 } catch (error) {
  console.log("failed to create hotel", error);
  return null;
 }
};
export const updateHotelAPI = async (id: string, formData: any): Promise<any> => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/update-hotel/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log("failed to update hotel", error);
    return null;
  }
};

export const exportHotelsAPI = async (exportType: "all" | "current"): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/hotel/export?type=${exportType}`,
      {
        responseType: 'blob', // Important for file downloads
      }
    );
    return data;
  } catch (error) {
    console.log("failed to export hotels", error);
    return null;
  }
};