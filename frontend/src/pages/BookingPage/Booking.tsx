import { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Package,
  Eye,
  Download,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/BookingSlice";
import { useGetAllBookings } from "../../hooks/Bookingshook";
import { fetchBookingById, fetchBookingRevenue } from "../../api/Bookings";
import { setSingleBooking } from "../../redux/BookingSlice";
import type { BookingsType } from "../../types";
import SingleBooking from "./SingleBooking";

export default function BookingDashboard() {
  useGetAllBookings();
  const dispatch = useDispatch();
  const { AllBookings } = useSelector((state: RootState) => state.Bookings);
  
  const [selectedBooking, setSelectedBooking] = useState<BookingsType | null>(
    null
  );
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState<number[]>(new Array(12).fill(0));
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  // Fetch booking details when a booking is selected
  useEffect(() => {
    if (selectedBooking?._id) {
      const fetchBookingDetails = async () => {
        try {
          const response = await fetchBookingById(selectedBooking._id);
          // Backend returns { msg: "...", data: [booking] } where booking is an array
          const bookingData = Array.isArray(response.data) ? response.data[0] : response.data;
          dispatch(setSingleBooking(bookingData));
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      };
      fetchBookingDetails();
    } else {
      // Clear SingleBooking when modal is closed
      dispatch(setSingleBooking(null));
    }
  }, [selectedBooking, dispatch]);

  // Calculate totalRevenue from AllBookings
  useEffect(() => {
    if (AllBookings.length > 0) {
      const total = AllBookings.reduce((sum: number, b: BookingsType) => sum + b.amount, 0);
      setTotalRevenue(total);
    } else {
      const total = AllBookings.reduce((sum, b) => sum + b.amount, 0);
      setTotalRevenue(total);
    }
  }, [AllBookings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch revenue overview from backend
  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setLoadingRevenue(true);
        const res = await fetchBookingRevenue();
        const series = new Array(12).fill(0);
        (res.data || []).forEach((item) => {
          const idx = (item.month || 0) - 1;
          if (idx >= 0 && idx < 12) {
            series[idx] = Number(item.totalRevenue) || 0;
          }
        });
        setRevenueSeries(series);
      } catch (error) {
        console.error("Failed to load revenue overview", error);
        setRevenueSeries(new Array(12).fill(0));
      } finally {
        setLoadingRevenue(false);
      }
    };
    loadRevenue();
  }, []);

  const revenueChartData = revenueSeries;
  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxRevenueValue = Math.max(...revenueChartData, 1);

  // If a booking is selected, show the SingleBooking component instead
  if (selectedBooking) {
    return <SingleBooking onClose={() => setSelectedBooking(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Bookings</h1>
            </div>
            <div className="flex gap-3">
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
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">
              {AllBookings.length}
            </p>
        </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalRevenue)}
            </p>
        </div>
      </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 border-l-4 border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>Custom</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Package Name"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Filter by User Name"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

        {/* Revenue Graph */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Revenue Overview
            </h2>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>
      </div>
          <div className="relative h-64 pb-8">
            {loadingRevenue ? (
              <div className="flex items-center justify-center h-full text-sm text-slate-500">
                Loading revenue...
              </div>
            ) : (
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={20 + i * 40}
                  x2="760"
                  y2={20 + i * 40}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              ))}
              
              {/* Line path */}
              <polyline
                points={revenueChartData.map((value, index) => {
                  const x = 40 + (index * (720 / (revenueChartData.length - 1)));
                  const y = 180 - ((value / maxRevenueValue) * 160);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Gradient fill under the line */}
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <polygon
                points={`40,180 ${revenueChartData.map((value, index) => {
                  const x = 40 + (index * (720 / (revenueChartData.length - 1)));
                  const y = 180 - ((value / maxRevenueValue) * 160);
                  return `${x},${y}`;
                }).join(' ')} 760,180`}
                fill="url(#revenueGradient)"
              />
              
              {/* Data points */}
              {revenueChartData.map((value, index) => {
                const x = 40 + (index * (720 / (revenueChartData.length - 1)));
                const y = 180 - ((value / maxRevenueValue) * 160);
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#6366f1"
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-7 transition-all cursor-pointer"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-xs font-medium fill-slate-700"
                      fontSize="10"
                    >
                      {formatCurrency(value).replace('₹', '₹')}
                    </text>
                  </g>
                );
              })}
            </svg>
            )}
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
              {chartLabels.map((label, index) => (
                <span key={index} className="text-xs text-slate-600 font-medium">
                  {label}
                </span>
              ))}
            </div>
          </div>
      </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden border-l-4 border-indigo-500">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Bookings</h2>
            <p className="text-sm text-slate-600 mt-1">
              All booking transactions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
            </tr>
          </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {AllBookings?.map((b)=> (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-50 rounded-full">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {b.user?.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">
                          {b.packageId?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(b.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB') : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedBooking(b as BookingsType)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            </div>
          </div>
    </div>
  );
}
