import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCurrentUser, logout as logoutAction } from "../redux/userSlice";
import { verifyAdmin, logout, signin } from "../api/authApi";

interface SigninCredentials {
  adminId: string;
  password: string;
}

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

export const useAdminSignin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SigninCredentials) => signin(data),
    onSuccess: (data) => {
      dispatch(setCurrentUser(data));
      void queryClient.invalidateQueries({ queryKey: ["verifyAdmin"] });
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(logoutAction());
      void queryClient.removeQueries({ queryKey: ["verifyAdmin"] });
      window.location.href = `${window.location.origin}/admin/signin`;
    },
    onError: (error) => {
      console.error("Logout error:", error);
      dispatch(logoutAction());
      void queryClient.removeQueries({ queryKey: ["verifyAdmin"] });
      window.location.href = `${window.location.origin}/admin/signin`;
    },
  });
};
