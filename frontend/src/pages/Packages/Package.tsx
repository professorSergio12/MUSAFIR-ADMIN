import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/packagesSlice";
import { useGetAllPackages } from "../../hooks/PackageHook";
import CreatePackage from "./CreatePackage";
import PackageCards from "./PackageCards";
import PackageList from "./PackageList";
import type { AllPackagesType } from "../../types";

export default function PackageDashboard() {
  const navigate = useNavigate();
  useGetAllPackages(true);
  const { AllPackage } = useSelector((state: RootState) => state.Packages);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  // If create form is open, show the CreatePackage component
  if (openCreateModal) {
    return <CreatePackage onClose={() => setOpenCreateModal(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Packages</h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage travel packages and destinations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Create Package
              </button>
              <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" /> Export Excel
              </button>
            </div>
          </div>
        </div>
        </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Section */}
        <PackageCards />

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search Package Name"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Categories</option>
              <option>Adventure</option>
              <option>Relaxation</option>
              <option>Mountain</option>
            </select>
            <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Packages Table */}
        <PackageList
          AllPackage={AllPackage}
          onPackageClick={(pkg: AllPackagesType) =>
            navigate(`/packages/${pkg._id}`)
          }
        />
      </div>
    </div>
  );
}
