import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SinglePackage from "./SinglePackage";
import { useGetPackageById } from "../../hooks/PackageHook";
import type { RootState } from "../../redux/packagesSlice";
import { setSinglePackage } from "../../redux/packagesSlice";

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SinglePackage: packageData } = useSelector((state: RootState) => state.Packages);

  const { isLoading } = useGetPackageById(id || "", !!id);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setSinglePackage(null));
    };
  }, [dispatch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 text-sm">Invalid package id</p>
          <button
            onClick={() => navigate("/packages")}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !packageData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">
            {isLoading ? "Loading package details..." : "Package not found"}
          </p>
          <button
            onClick={() => navigate("/packages")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return <SinglePackage onClose={() => navigate("/packages")} />;
}
