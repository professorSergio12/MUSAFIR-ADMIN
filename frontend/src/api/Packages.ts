import axiosInstance from "./axiosInstance";

export const fetchALLPackages = async (): Promise<any> => {
  const data = await axiosInstance.get("/api/admin/package");
  return data.data;
};

export const fetchPackageById = async (id: string): Promise<any> => {
  const data = await axiosInstance.get(`/api/admin/package/${id}`);
  return data.data;
};

export const createPackageAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/package/create-package",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    console.log("failed to create package", error);
    return null;
  }
};
