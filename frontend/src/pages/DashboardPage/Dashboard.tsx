import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPopularBookings,
  useLatestReview,
  useRecentBookings,
  useSummary,
} from "../../hooks/dashboardhook";
import type { RootState } from "../../redux/dashboardSlice";
import { fetchMonthlyRevenue } from "../../api/Dashboard";
import {
  Calendar,
  Package,
  Hotel,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  User,
  MapPin,
  Plane,
} from "lucide-react";

type MonthlyStat = {
  month: number;
  totalRevenue: number;
  totalBookings: number;
};

export default function Dashboard() {
  useSummary();
  useRecentBookings();
  useGetPopularBookings();
  useLatestReview();
  const { dashboard, recentBookings, popularPackges, latestReviews } =
    useSelector((state: RootState) => state.Dashboard);

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [loadingMonthly, setLoadingMonthly] = useState<boolean>(false);

  const stats = [
    {
      label: "Total Bookings",
      value: dashboard?.totalBookings || 0,
      icon: Calendar,
    },
    {
      label: "Active Packages",
      value: dashboard?.activePackages || 0,
      icon: Package,
    },
    {
      label: "Total Hotels",
      value: dashboard?.totalHotels || 0,
      icon: Hotel,
    },
    {
      label: "Total Revenue",
      value: dashboard?.totalRevenue || 0,
      icon: DollarSign,
    },
  ];

  console.log(recentBookings[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch monthly revenue & bookings
  useEffect(() => {
    const loadMonthly = async () => {
      try {
        setLoadingMonthly(true);
        const res = await fetchMonthlyRevenue();
        const normalized = (res.data || []).map((item: any) => ({
          month: item.month,
          totalRevenue: Number(item.totalRevenue) || 0,
          totalBookings: Number(item.totalBookings) || 0,
        }));
        setMonthlyStats(normalized);
      } catch (error) {
        console.error("Failed to load monthly stats", error);
        setMonthlyStats([]);
      } finally {
        setLoadingMonthly(false);
      }
    };
    loadMonthly();
  }, []);

  const revenueData = monthlyStats;
  const bookingsData = monthlyStats;
  const maxRevenue =
    Math.max(...revenueData.map((item) => item.totalRevenue || 0)) || 1;
  const maxBookings =
    Math.max(...bookingsData.map((item) => item.totalBookings || 0)) || 1;
  const chartHeight = 200; // px height for bars

  // Colorful bar colors
  const revenueColors = [
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-indigo-500",
  ];
  const bookingColors = [
    "bg-blue-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
  ];

  const getMonthLabel = (monthNumber: number) => {
    const date = new Date(2000, monthNumber - 1, 1);
    return date.toLocaleString("en", { month: "short" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {/* Header removed as per request */}

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Icon className="w-5 h-5 text-sky-500" />
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {item.label === "Total Revenue"
                    ? formatCurrency(item.value)
                    : item.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Per Week Chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-slate-700">
                  Revenue Per Month
                </h3>
                <div className="p-2 bg-sky-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                </div>
              </div>
              {loadingMonthly ? (
                <div className="flex items-center justify-center h-56 text-sm text-slate-500">
                  Loading revenue...
                </div>
              ) : revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-56 text-sm text-slate-500">
                  No revenue data
                </div>
              ) : (
                <div className="flex items-end justify-between gap-3 h-56 pb-6 border-b border-slate-200 px-2">
                  {revenueData.map((item, index) => {
                    const barHeightPx = Math.max(
                      (item.totalRevenue / maxRevenue) * chartHeight,
                      12
                    );
                    const color = revenueColors[index % revenueColors.length];
                    return (
                      <div
                        key={`${item.month}-${index}`}
                        className="flex flex-col items-center flex-1 gap-2 min-w-0"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-end relative">
                          <div
                            className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80 cursor-pointer shadow-sm`}
                            style={{
                              height: `${barHeightPx}px`,
                            }}
                            title={formatCurrency(item.totalRevenue)}
                          />
                        </div>
                        <div className="text-center w-full mt-2">
                          <p className="text-xs font-medium text-slate-700">
                            {getMonthLabel(item.month)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatCurrency(item.totalRevenue)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bookings Per Week Chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-slate-700">
                  Bookings Per Month
                </h3>
                <div className="p-2 bg-sky-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-sky-500" />
                </div>
              </div>
              {loadingMonthly ? (
                <div className="flex items-center justify-center h-56 text-sm text-slate-500">
                  Loading bookings...
                </div>
              ) : bookingsData.length === 0 ? (
                <div className="flex items-center justify-center h-56 text-sm text-slate-500">
                  No bookings data
                </div>
              ) : (
                <div className="flex items-end justify-between gap-3 h-56 pb-6 border-b border-slate-200 px-2">
                  {bookingsData.map((item, index) => {
                    const barHeightPx = Math.max(
                      (item.totalBookings / maxBookings) * chartHeight,
                      12
                    );
                    const color = bookingColors[index % bookingColors.length];
                    return (
                      <div
                        key={`${item.month}-${index}`}
                        className="flex flex-col items-center flex-1 gap-2 min-w-0"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-end relative">
                          <div
                            className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80 cursor-pointer shadow-sm`}
                            style={{
                              height: `${barHeightPx}px`,
                            }}
                            title={`${item.totalBookings} bookings`}
                          />
                        </div>
                        <div className="text-center w-full mt-2">
                          <p className="text-xs font-medium text-slate-700">
                            {getMonthLabel(item.month)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.totalBookings} bookings
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Status & Popular Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Booking Status Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Booking Status
              </h2>
              <div className="p-2 bg-sky-50 rounded-lg">
                <Calendar className="w-4 h-4 text-sky-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Confirmed</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">80</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Pending</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">25</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <XCircle className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Cancelled</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">15</span>
              </div>
            </div>
          </div>

          {/* Popular Packages */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Popular Packages
              </h2>
              <div className="p-2 bg-sky-50 rounded-lg">
                <Plane className="w-4 h-4 text-sky-500" />
              </div>
            </div>
            <div className="space-y-2">
              {popularPackges?.map((pkg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-medium text-slate-900">
                      {pkg.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {pkg.totalBookings}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-sky-500">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Bookings
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Latest booking transactions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentBookings.map((b) => (
                  <tr
                    key={b?._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-sky-50 rounded-full">
                          <User className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {b.user?.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-700">
                        {b.packageId?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(b.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {b.createdAt
                          ? new Date(b.createdAt as unknown as string)
                              .toISOString()
                              .split("T")[0]
                          : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-l-4 border-sky-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Latest Reviews
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Customer feedback and ratings
              </p>
            </div>
            <div className="p-2 bg-sky-50 rounded-lg">
              <Star className="w-4 h-4 text-sky-500" />
            </div>
          </div>

          <div className="space-y-3">
            {latestReviews?.map((r) => (
              <div
                key={r._id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-50 rounded-full">
                      <User className="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {r.user?.username}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r.package?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating
                            ? "text-sky-500 fill-sky-500"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {r.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
