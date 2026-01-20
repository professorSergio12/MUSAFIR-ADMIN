import axios from "axios";

export const fetchALLFoodOptions = async (page: number = 1): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal?page=${page}`
  );
  return data.data;
};

export const fetchFoodOptionById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/${id}`
  );
  return data.data;
};

export const fetchFoodOptionsByQuery = async (query: string, value: string, page: number = 1): Promise<any> => {
  try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/query?${query}=${value}&page=${page}`);
    return data.data;
  } catch (error) {
    console.log("failed by query", error);
    return null;
  }
};

// Lightweight picker endpoint (searchable dropdown)
export const fetchFoodPicker = async (q: string = "", limit: number = 50): Promise<any> => {
  try {
    const data = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/picker?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    return data.data;
  } catch (error) {
    console.log("failed food picker", error);
    return null;
  }
};

export const exportFoodOptionsAPI = async (exportType: "all" | "current"): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/export?type=${exportType}`,
      {
        responseType: 'blob', // Important for file downloads
      }
    );
    return data;
  } catch (error) {
    console.log("failed to export food options", error);
    return null;
  }
};

export const createFoodOptionAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/create-meal`,
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

export const updateFoodOptionAPI = async (id: string, formData: any): Promise<any> => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/meal/update-meal/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("failed to update food option", error);
    return null;
  }
};
