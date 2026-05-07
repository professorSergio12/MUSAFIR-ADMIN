import axiosInstance from "./axiosInstance";

export const fetchALLHotels = async (page: number = 1): Promise<any> => {
  const data = await axiosInstance.get(`/api/admin/hotel?page=${page}`);
  return data.data;
};

export const fetchHotelsById = async (id: string): Promise<any> => {
  const data = await axiosInstance.get(`/api/admin/hotel/${id}`);
  return data.data;
};

export const fetchHotelsByQuery = async (
  query: string,
  value: string,
  page: number = 1,
): Promise<any> => {
  try {
    const data = await axiosInstance.get(
      `/api/admin/hotel/query?${query}=${value}&page=${page}`,
    );
    return data.data;
  } catch (error) {
    console.log("failed by Name", error);
    return null;
  }
};

export const fetchHotelPicker = async (
  q: string = "",
  limit: number = 50,
): Promise<any> => {
  try {
    const data = await axiosInstance.get(
      `/api/admin/hotel/picker?q=${encodeURIComponent(q)}&limit=${limit}`,
    );
    return data.data;
  } catch (error) {
    console.log("failed hotel picker", error);
    return null;
  }
};

export const createHotelAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/hotel/create-hotel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.data;
  } catch (error) {
    console.log("failed to create hotel", error);
    return null;
  }
};

export const updateHotelAPI = async (
  id: string,
  formData: any,
): Promise<any> => {
  try {
    const { data } = await axiosInstance.put(
      `/api/admin/hotel/update-hotel/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.data;
  } catch (error) {
    console.log("failed to update hotel", error);
    return null;
  }
};

export const exportHotelsAPI = async (
  exportType: "all" | "current",
): Promise<any> => {
  try {
    const { data } = await axiosInstance.get(
      `/api/admin/hotel/export?type=${exportType}`,
      {
        responseType: "blob",
      },
    );
    return data;
  } catch (error) {
    console.log("failed to export hotels", error);
    return null;
  }
};
