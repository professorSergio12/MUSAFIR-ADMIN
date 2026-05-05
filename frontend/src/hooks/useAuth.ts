import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCurrentUser, logout as logoutAction } from "../redux/userSlice";
import { verifyAdmin, logout } from "../api/authApi";

// Hook to verify admin authentication from Musafir backend
export const useVerifyAdmin = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["verifyAdmin"],
    queryFn: async () => {
      try {
        const data = await verifyAdmin();
        dispatch(setCurrentUser(data));
        return data;
      } catch (error: any) {
        // Clear user state on error
        dispatch(setCurrentUser(null));
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - cache the verification
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      console.log("Logout success");
      dispatch(logoutAction());
      // Redirect to Musafir admin login page
      window.location.href = "http://localhost:5173/admin/signin";
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};
