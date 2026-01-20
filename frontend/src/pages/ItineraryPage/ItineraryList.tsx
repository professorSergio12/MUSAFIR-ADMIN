import {
  MapPin,
  Eye,
  Trash2,
} from "lucide-react";
import Pagination from "../../components/Pagination";
import type { AllItneraryTypes } from "../../types";

interface ItineraryListProps {
  AllLocation: AllItneraryTypes[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItinerary: number;
  onPageChange: (page: number) => void;
  onLocationClick: (location: AllItneraryTypes) => void;
}

export default function ItineraryList({
  AllLocation,
  currentPage,
  itemsPerPage,
  totalPages,
  totalItinerary,
  onPageChange,
  onLocationClick,
}: ItineraryListProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden border-l-4 border-indigo-500">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Itinerary Locations
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          All itinerary locations and destinations
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {AllLocation.map((loc, index) => (
              <tr key={loc._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {loc.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-700">
                    {loc.country}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-700">
                    {loc.city || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    Day {loc.day}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onLocationClick(loc)}
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
            {AllLocation.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No itinerary locations found.
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
        totalItems={totalItinerary}
      />
    </div>
  );
}

