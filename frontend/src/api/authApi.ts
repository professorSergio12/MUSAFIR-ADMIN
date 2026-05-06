import authAxiosInstance from "./authAxiosInstance";

interface SigninData {
  adminId: string;
  password: string;
}

export const verifyAdmin = async () => {
  const response = await authAxiosInstance.get("/api/admin/auth/verify");
  return response.data;
};

export const signin = async (data: SigninData) => {
  const response = await authAxiosInstance.post("/api/admin/auth/signin", data);
  return response.data;
};

export const logout = async () => {
  const response = await authAxiosInstance.post("/api/admin/auth/logout");
  return response.data;
};
