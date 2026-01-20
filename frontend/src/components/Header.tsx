import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Hotel,
  Package,
  MapPin,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { fetchGlobalSearch } from "../api/Dashboard";

interface SearchResult {
  hotels: any[];
  packages: any[];
  locations: any[];
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search API call
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchGlobalSearch(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (type: "hotel" | "package" | "location", id: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    if (type === "hotel") {
      navigate(`/hotels/${id}`);
    } else if (type === "package") {
      navigate(`/packages/${id}`);
    } else if (type === "location") {
      navigate(`/itinerary/${id}`);
    }
  };

  const hasResults =
    searchResults &&
    (searchResults.hotels?.length > 0 ||
      searchResults.packages?.length > 0 ||
      searchResults.locations?.length > 0);

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-slate-200 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 w-48 flex-shrink-0">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                MUSAFIR
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex justify-center" ref={searchRef}>
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (hasResults) setShowDropdown(true);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
              )}

              {/* Dropdown Results */}
              {showDropdown && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Searching...
                    </div>
                  ) : hasResults ? (
                    <div className="p-2">
                      {/* Hotels Section */}
                      {searchResults.hotels?.length > 0 && (
                        <div className="mb-2">
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Hotels
                          </div>
                          {searchResults.hotels.map((hotel: any) => (
                            <div
                              key={hotel._id}
                              onClick={() => handleResultClick("hotel", hotel._id)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <Hotel className="w-4 h-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {hotel.name}
                                </p>
                                {hotel.city && (
                                  <p className="text-xs text-slate-500 truncate">
                                    {hotel.city}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Packages Section */}
                      {searchResults.packages?.length > 0 && (
                        <div className="mb-2">
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Packages
                          </div>
                          {searchResults.packages.map((pkg: any) => (
                            <div
                              key={pkg._id}
                              onClick={() => handleResultClick("package", pkg._id)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <Package className="w-4 h-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {pkg.name}
                                </p>
                                {pkg.country && (
                                  <p className="text-xs text-slate-500 truncate">
                                    {pkg.country}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Locations Section */}
                      {searchResults.locations?.length > 0 && (
                        <div className="mb-2">
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Locations
                          </div>
                          {searchResults.locations.map((location: any) => (
                            <div
                              key={location._id}
                              onClick={() => handleResultClick("location", location._id)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {location.name}
                                </p>
                                {(location.city || location.country) && (
                                  <p className="text-xs text-slate-500 truncate">
                                    {location.city ? `${location.city}, ${location.country}` : location.country}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right - Actions & User */}
          <div className="flex items-center gap-4 w-48 justify-end">
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-indigo-300 transition">
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
