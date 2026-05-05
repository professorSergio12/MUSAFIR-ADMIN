import authAxiosInstance from "./authAxiosInstance";

interface SigninData {
  email: string;
  password: string;
}

// Verify admin authentication from Musafir backend
export const verifyAdmin = async () => {
  const response = await authAxiosInstance.get("/api/auth/verify-admin");
  return response.data;
};

// Using Musafir backend for authentication (not used anymore, but kept for reference)
export const signin = async (data: SigninData) => {
  const response = await authAxiosInstance.post("/api/auth/signin", data);
  return response.data;
};

export const logout = async () => {
  const response = await authAxiosInstance.post("/api/auth/logout");
  return response.data;
};
