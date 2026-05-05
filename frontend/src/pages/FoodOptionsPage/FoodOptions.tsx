import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
} from "lucide-react";
import { useGetAllFoods } from "../../hooks/FoodOptions";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/FoodOption";
import { fetchFoodOptionsByQuery, exportFoodOptionsAPI } from "../../api/FoodOptions";
import { setAllFoods, setTotalFoods } from "../../redux/FoodOption";
import CreateFoodOptions from "./CreateFoodOptions";
import FoodOptionsCards from "./FoodOptionsCards";
import FoodOptionsList from "./FoodOptionsList";
import ExportButton from "../../components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import type { FoodOptionsByIdTypes } from "../../types";

export default function FoodOptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { AllFoods, totalFoods } = useSelector((state: RootState) => state.FoodOptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 10;

  // Calculate total pages from totalFoods
  const totalPages = Math.ceil(totalFoods / itemsPerPage);

  // Use hook for pagination when not searching
  useGetAllFoods(currentPage, !isSearching && !search && !typeFilter);

  // Search query for page 1
  const { data: searchDataPage1 } = useQuery({
    queryKey: ["foods", "search", { search, typeFilter, page: 1 }],
    queryFn: () => {
      const query = search ? "name" : typeFilter ? "type" : "";
      const value = search ? search : typeFilter ? typeFilter : "";
      return fetchFoodOptionsByQuery(query, value, 1);
    },
    enabled: !!(isSearching && (search || typeFilter) && currentPage === 1),
  });

  // Search query for pages > 1
  const { data: searchDataPageN } = useQuery({
    queryKey: ["foods", "search", { search, typeFilter, page: currentPage }],
    queryFn: () => {
      const query = search ? "name" : typeFilter ? "type" : "";
      const value = search ? search : typeFilter ? typeFilter : "";
      return fetchFoodOptionsByQuery(query, value, currentPage);
    },
    enabled: !!(isSearching && (search || typeFilter) && currentPage > 1),
  });

  // Update Redux when search data changes
  useEffect(() => {
    if (isSearching) {
      const data = currentPage === 1 ? searchDataPage1 : searchDataPageN;
      if (data) {
        dispatch(setAllFoods(data.data || []));
        dispatch(setTotalFoods(data.totalFoods || 0));
      }
    }
  }, [searchDataPage1, searchDataPageN, currentPage, isSearching, dispatch]);

  // Reset to page 1 and update isSearching when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(!!(search || typeFilter));
  }, [search, typeFilter]);

  // If create form is open, show the CreateFoodOptions component
  if (showCreateModal) {
    return <CreateFoodOptions onClose={() => setShowCreateModal(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Food Options Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage food options and meal plans
              </p>
            </div>
        <div className="flex gap-3">
              <button
            onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium"
          >
                <Plus className="w-4 h-4" /> Create Food Option
          </button>
              <ExportButton
                onExport={exportFoodOptionsAPI}
                fileNamePrefix="food_options"
                modalTitle="Export Food Options"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search Food Option..."
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
          </div>
      </div>

        {/* Stats Section */}
        <FoodOptionsCards />

        {/* Food Options Table */}
        <FoodOptionsList
          AllFoods={AllFoods}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalFoods={totalFoods}
          onPageChange={setCurrentPage}
          onFoodOptionClick={(foodOption: FoodOptionsByIdTypes) =>
            navigate(`/food-options/${foodOption._id}`)
          }
        />
      </div>
    </div>
  );
}
