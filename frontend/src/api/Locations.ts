import axios from "axios";

export const fetchALocation = async (page: number = 1): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary?page=${page}`
  );
  return data.data;
};

export const fetchLocationById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/${id}`
  );
  return data.data;
};

export const fetchLocationsByQuery = async (query: string, value: string, page: number = 1): Promise<any> => {
  try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/query?${query}=${value}&page=${page}`);
    return data.data;
  } catch (error) {
    console.log("failed by query", error);
    return null;
  }
};

// Lightweight picker endpoint (searchable dropdown)
export const fetchItineraryPicker = async (q: string = "", limit: number = 50): Promise<any> => {
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/picker?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    return data.data;
  } catch (error) {
    console.log("failed itinerary picker", error);
    return null;
  }
};

export const exportItineraryAPI = async (exportType: "all" | "current"): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/export?type=${exportType}`,
      {
        responseType: 'blob', // Important for file downloads
      }
    );
    return data;
  } catch (error) {
    console.log("failed to export itinerary", error);
    return null;
  }
};

export const createItineraryAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/create-itenerary`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log("failed to create itinerary", error);
    return null;
  }
};

export const updateItineraryAPI = async (id: string, formData: any): Promise<any> => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/itenerary/update-itenerary/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("failed to update itinerary", error);
    return null;
  }
};
