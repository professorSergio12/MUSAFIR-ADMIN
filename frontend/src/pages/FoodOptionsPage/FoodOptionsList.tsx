import {
  Eye,
  Trash2,
} from "lucide-react";
import Pagination from "../../components/Pagination";
import type { FoodOptionsByIdTypes } from "../../types";

interface FoodOptionsListProps {
  AllFoods: FoodOptionsByIdTypes[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalFoods: number;
  onPageChange: (page: number) => void;
  onFoodOptionClick: (foodOption: FoodOptionsByIdTypes) => void;
}

export default function FoodOptionsList({
  AllFoods,
  currentPage,
  itemsPerPage,
  totalPages,
  totalFoods,
  onPageChange,
  onFoodOptionClick,
}: FoodOptionsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden border-l-4 border-indigo-500">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Food Options List
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          All food options and meal plans
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Meals Included
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Surcharge / Day
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {AllFoods.map((opt: any, index: number) => (
              <tr key={opt._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    {opt.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {opt.foodOptions &&
                      opt.foodOptions.map((f: any, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {f.name}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    {formatCurrency(opt.surchargePerDay)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onFoodOptionClick(opt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {AllFoods.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No food options found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalFoods}
      />
    </div>
  );
}

