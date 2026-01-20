import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Package,
  Hotel,
  Utensils,
  MapPin,
  Image,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [openPackages, setOpenPackages] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname === "/";
  };

  return (
    <aside className="fixed left-0 top-[73px] w-64 h-[calc(100vh-73px)] bg-white border-r border-slate-200 flex flex-col z-10">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 pt-6">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActiveRoute("/dashboard")
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 ${
                  isActiveRoute("/dashboard")
                    ? "text-indigo-600"
                    : "text-slate-500"
                }`}
              />
              Dashboard
            </Link>
          </li>

          {/* Booking */}
          <li>
            <Link
              to="/booking"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/booking")
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Calendar
                className={`w-4 h-4 ${
                  isActive("/booking") ? "text-indigo-600" : "text-slate-500"
                }`}
              />
              Booking
            </Link>
          </li>

          {/* Packages Dropdown */}
          <li>
            <div
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                isActive("/packages") || openPackages
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setOpenPackages(!openPackages)}
            >
              <div className="flex items-center gap-3">
                <Package
                  className={`w-4 h-4 ${
                    isActive("/packages") || openPackages
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }`}
                />
                <Link
                  to="/packages"
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Packages
                </Link>
              </div>
              {openPackages ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </div>

            {/* Submenu */}
            {openPackages && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/hotels"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive("/hotels")
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Hotel
                      className={`w-4 h-4 ${
                        isActive("/hotels")
                          ? "text-indigo-600"
                          : "text-slate-500"
                      }`}
                    />
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link
                    to="/food-options"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive("/food-options")
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Utensils
                      className={`w-4 h-4 ${
                        isActive("/food-options")
                          ? "text-indigo-600"
                          : "text-slate-500"
                      }`}
                    />
                    Food Options
                  </Link>
                </li>
                <li>
                  <Link
                    to="/itinerary"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive("/itinerary")
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        isActive("/itinerary")
                          ? "text-indigo-600"
                          : "text-slate-500"
                      }`}
                    />
                    Itinerary
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Gallery */}
          <li>
            <Link
              to="/gallery"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/gallery")
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Image
                className={`w-4 h-4 ${
                  isActive("/gallery") ? "text-indigo-600" : "text-slate-500"
                }`}
              />
              Gallery
            </Link>
          </li>

          {/* Reviews */}
          <li>
            <Link
              to="/reviews"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/reviews")
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MessageSquare
                className={`w-4 h-4 ${
                  isActive("/reviews") ? "text-indigo-600" : "text-slate-500"
                }`}
              />
              Reviews
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}
