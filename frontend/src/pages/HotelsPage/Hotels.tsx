import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/HotelSlice";
import { fetchHotelsByQuery, exportHotelsAPI } from "../../api/Hotels";
import { setAllHotels, setTotalHotels } from "../../redux/HotelSlice";
import { useGetAllHotels } from "../../hooks/Hotels";
import CreateHotel from "./CreateHotel";
import HotelCards from "./HotelCards";
import HotelList from "./HotelList";
import ExportButton from "../../components/ExportButton";
import type { AllHotelsType } from "../../types";
import { useQuery } from "@tanstack/react-query";


export default function HotelDashboard() {
  const { AllHotels, totalHotels } = useSelector((state: RootState) => state.Hotels);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [hotelName, setHotelName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [tier, setTier] = useState<string>("");
  const itemsPerPage = 10;

  // Calculate total pages from totalHotels
  const totalPages = Math.ceil(totalHotels / itemsPerPage);

  // Use hook for pagination when not searching
  useGetAllHotels(currentPage, !isSearching && !hotelName && !country && !tier);

  // Search query for page 1
  const { data: searchDataPage1 } = useQuery({
    queryKey: ["hotels", "search", { hotelName, country, tier, page: 1 }],
    queryFn: () => {
      const query = hotelName ? "hotel" : country ? "cntry" : tier ? "tier" : "";
      const value = hotelName ? hotelName : country ? country : tier ? tier : "";
      return fetchHotelsByQuery(query, value, 1);
    },
    enabled: !!(isSearching && (hotelName || country || tier) && currentPage === 1),
  });

  // Search query for pages > 1
  const { data: searchDataPageN } = useQuery({
    queryKey: ["hotels", "search", { hotelName, country, tier, page: currentPage }],
    queryFn: () => {
       const query = hotelName ? "hotel" : country ? "cntry" : tier ? "tier" : "";
      const value = hotelName ? hotelName : country ? country : tier ? tier : "";
      return fetchHotelsByQuery(query, value, currentPage);
    },
    enabled: !!(isSearching && (hotelName || country) && currentPage > 1),
  });

  // Update Redux when search data changes
  useEffect(() => {
    if (isSearching) {
      const data = currentPage === 1 ? searchDataPage1 : searchDataPageN;
      if (data) {
        dispatch(setAllHotels(data.data || []));
        dispatch(setTotalHotels(data.totalHotels || 0));
      }
    }
  }, [searchDataPage1, searchDataPageN, currentPage, isSearching, dispatch]);

  // Reset to page 1 and update isSearching when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(!!(hotelName || country || tier));
  }, [hotelName, country, tier]);

  // If create form is open, show the CreateHotel component
  if (openForm) {
    return <CreateHotel onClose={() => setOpenForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Hotel Dashboard
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Create Hotel
              </button>
              <ExportButton
                onExport={exportHotelsAPI}
                fileNamePrefix="hotels"
                modalTitle="Export Hotels"
                buttonText="Export"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              placeholder="Search by hotel name"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              value={country}
              placeholder="Filter by country"
              onChange={(e) => setCountry(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Filter by Tier</option>
              <option value="Budget">Budget</option>
              <option value="Standard">Standard</option>
              <option value="Luxury">Luxury</option>
            </select>
            <button
              onClick={() => {
                setHotelName("");
                setCountry("");
                setTier("");
                setCurrentPage(1);
              }}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <HotelCards />

        {/* Hotels Table */}
        <HotelList
          AllHotels={AllHotels}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalHotels={totalHotels}
          onPageChange={setCurrentPage}
          onHotelClick={(hotel: AllHotelsType) =>
            navigate(`/hotels/${hotel._id}`)
          }
        />
      </div>
    </div>
  );
}
