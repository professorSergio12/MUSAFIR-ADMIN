import type { ReactNode } from "react";
import { useEffect } from "react";
import { useVerifyAdmin } from "../hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { data: user, isLoading, isError } = useVerifyAdmin();

  useEffect(() => {
    // Immediately redirect if error or not admin (no flash of content)
    if (!isLoading && (isError || !user || user.role !== "admin")) {
      // window.location.href = "http://localhost:5173/admin/signin";
      window.location.href = `${import.meta.env.VITE_MUSAFIR_ADMIN_URL}/admin/signin`;
    }
  }, [isLoading, isError, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-700 mb-2">
            Verifying admin access...
          </div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  // If error or user is not admin, show nothing (redirecting)
  if (isError || !user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
