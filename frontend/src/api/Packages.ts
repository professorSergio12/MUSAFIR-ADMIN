import axios from "axios";

export const fetchALLPackages = async (): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/package`
  );
  return data.data;
};

export const fetchPackageById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/package/${id}`
  );
  return data.data;
};

export const createPackageAPI = async (formData: any): Promise<any> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/package/create-package`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("failed to create package", error);
    return null;
  }
};