import { Package as PackageIcon, DollarSign, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/packagesSlice";
import { useEffect, useState } from "react";
import type { AllPackagesType } from "../../types";

export default function PackageCards() {
  const { AllPackage } = useSelector((state: RootState) => state.Packages);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Calculate totalRevenue from AllPackage
  useEffect(() => {
    if (AllPackage.length > 0) {
      const total = AllPackage.reduce((sum: number, p: AllPackagesType) => sum + p.basePrice, 0);
      setTotalRevenue(total);
    }
  }, [AllPackage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <PackageIcon className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Total Packages</p>
        <p className="text-2xl font-bold text-slate-900">
          {AllPackage.length}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
        <p className="text-2xl font-bold text-slate-900">
          {formatCurrency(totalRevenue)}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Average Price</p>
        <p className="text-2xl font-bold text-slate-900">
          {AllPackage.length > 0 ? formatCurrency(totalRevenue / AllPackage.length) : formatCurrency(0)}
        </p>
      </div>
    </div>
  );
}

