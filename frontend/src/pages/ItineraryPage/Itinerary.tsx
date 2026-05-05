import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
} from "lucide-react";
import { useGetAllLocation } from "../../hooks/Locations";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/Locations";
import { fetchLocationsByQuery, exportItineraryAPI } from "../../api/Locations";
import { setAllLocation, setTotalItinerary } from "../../redux/Locations";
import CreateItinerary from "./CreateItnerarypage";
import ItineraryCards from "./ItineraryCards";
import ItineraryList from "./ItineraryList";
import ExportButton from "../../components/ExportButton";
import type { AllItneraryTypes } from "../../types";
import { useQuery } from "@tanstack/react-query";

export default function ItineraryDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { AllLocation, totalItinerary } = useSelector((state: RootState) => state.Locations);

  // Filters
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 10;

  // Calculate total pages from totalItinerary
  const totalPages = Math.ceil(totalItinerary / itemsPerPage);

  // Use hook for pagination when not searching
  useGetAllLocation(currentPage, !isSearching && !search && !countryFilter && !dayFilter);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Helper function to get query and value
  const getQueryAndValue = () => {
    if (search) {
      return { query: "name", value: search };
    } else if (countryFilter) {
      return { query: "country", value: countryFilter };
    } else if (dayFilter) {
      return { query: "day", value: dayFilter };
    }
    return { query: "", value: "" };
  };

  // Search query for page 1
  const { query: query1, value: value1 } = getQueryAndValue();
  const { data: searchDataPage1 } = useQuery({
    queryKey: ["locations", "search", { search, countryFilter, dayFilter, page: 1 }],
    queryFn: () => fetchLocationsByQuery(query1, value1, 1),
    enabled: !!(isSearching && (search || countryFilter || dayFilter) && currentPage === 1),
  });

  // Search query for pages > 1
  const { query: queryN, value: valueN } = getQueryAndValue();
  const { data: searchDataPageN } = useQuery({
    queryKey: ["locations", "search", { search, countryFilter, dayFilter, page: currentPage }],
    queryFn: () => fetchLocationsByQuery(queryN, valueN, currentPage),
    enabled: !!(isSearching && (search || countryFilter || dayFilter) && currentPage > 1),
  });

  // Update Redux when search data changes
  useEffect(() => {
    if (isSearching) {
      const data = currentPage === 1 ? searchDataPage1 : searchDataPageN;
      if (data) {
        dispatch(setAllLocation(data.data || []));
        dispatch(setTotalItinerary(data.totalItinerary || 0));
      }
    }
  }, [searchDataPage1, searchDataPageN, currentPage, isSearching, dispatch]);

  // Unique Country List
  const countries = AllLocation.length > 0
    ? [...new Set(AllLocation.map((l: AllItneraryTypes) => l.country))]
    : [];

  // Reset to page 1 and update isSearching when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(!!(search || countryFilter || dayFilter));
  }, [search, countryFilter, dayFilter]);

  // If create form is open, show the CreateItinerary component
  if (showCreateModal) {
    return <CreateItinerary onClose={() => setShowCreateModal(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Itinerary Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage itinerary locations and destinations
              </p>
            </div>
        <div className="flex gap-3">
              <button
            onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium"
          >
                <Plus className="w-4 h-4" /> Add Location
          </button>
              <ExportButton
                onExport={exportItineraryAPI}
                fileNamePrefix="itinerary"
                modalTitle="Export Itinerary"
                buttonText="Export"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Location Name..."
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="">Filter by Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
        >
          <option value="">Filter by Day</option>
              {Array.from(new Set(AllLocation.map((l: AllItneraryTypes) => l.day))).map((day: number) => (
            <option key={day} value={day}>
              Day {day}
            </option>
          ))}
        </select>
          </div>
      </div>

        {/* Stats Section */}
        <ItineraryCards />

        {/* Itinerary Table */}
        <ItineraryList
          AllLocation={AllLocation}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalItinerary={totalItinerary}
          onPageChange={setCurrentPage}
          onLocationClick={(location: AllItneraryTypes) =>
            navigate(`/itinerary/${location._id}`)
          }
        />
      </div>
    </div>
  );
}
