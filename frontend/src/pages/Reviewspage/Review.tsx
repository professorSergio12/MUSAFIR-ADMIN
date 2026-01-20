import { useMemo, useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  User,
  Package,
  Calendar,
  Eye,
  Trash2,
  X,
  ThumbsUp,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/reviewsSlice";
import { setSingleReview } from "../../redux/reviewsSlice";
import { useGetAllReviews, useGetReviewById, useUpdateReviewComment } from "../../hooks/Reviews";
import Pagination from "../../components/Pagination";
import { Save } from "lucide-react";

export default function ReviewDashboard() {
  const dispatch = useDispatch();
  const { AllReviews, SingleReview, totalReviews } = useSelector(
    (state: RootState) => state.Reviews
  );

  // UI state
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [filterPackage, setFilterPackage] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>(""); // "5","4",...
  const [currentPage, setCurrentPage] = useState(1);
  const [adminComment, setAdminComment] = useState<string>("");

  // Mutation hook for updating comment
  const updateCommentMutation = useUpdateReviewComment();

  // Sync adminComment with SingleReview when it changes
  useEffect(() => {
    if (SingleReview) {
      setAdminComment(SingleReview.comment || "");
    }
  }, [SingleReview]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((totalReviews || 0) / itemsPerPage);

  // Server-side list (pagination + q search)
  useGetAllReviews(currentPage, true, searchText);

  // Single review (for modal)
  useGetReviewById(selectedReviewId, !!selectedReviewId);

  // Clear SingleReview when modal closes
  useEffect(() => {
    if (!selectedReviewId) {
      dispatch(setSingleReview(null));
    }
  }, [selectedReviewId, dispatch]);

  // Derived unique packages for the package filter
  const packageList = useMemo(
    () => Array.from(new Set(AllReviews.map((r) => r.package.name))),
    [AllReviews]
  );

  // Stats
  const averageRating = useMemo(
    () =>
      (totalReviews || 0) === 0
        ? 0
        : Math.round(
            (AllReviews.reduce((acc, r) => acc + r.rating, 0) /
              Math.max(AllReviews.length, 1)) *
              10
          ) / 10,
    [AllReviews, totalReviews]
  );
  const highestRating = useMemo(
    () => (AllReviews.length ? Math.max(...AllReviews.map((r) => r.rating)) : 0),
    [AllReviews]
  );

  // Client-side filters on the CURRENT PAGE results only (package/rating)
  const filtered = AllReviews.filter((r) => {
    if (filterPackage && r.package.name !== filterPackage) return false;
    if (filterRating && String(r.rating) !== filterRating) return false;

    return true;
  });

  function handleDelete(id: string) {
    // TODO: wire delete API if needed
    console.log("delete review", id);
    setSelectedReviewId("");
  }

  function handleSaveComment() {
    if (selectedReviewId) {
      updateCommentMutation.mutate(
        { id: selectedReviewId, comment: adminComment },
        {
          onSuccess: () => {
            // Comment saved successfully, state will update via query invalidation
          },
        }
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Reviews Dashboard
            </h1>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-900">{totalReviews || 0}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Star className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-900">
                {averageRating}
              </p>
              <Star className="w-5 h-5 text-indigo-500 fill-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Highest Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-900">
                {highestRating}
              </p>
              <Star className="w-5 h-5 text-indigo-500 fill-indigo-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search by user, package, title or text..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
            >
              <option value="">All Packages</option>
              {packageList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="1">1 ⭐</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden border-l-4 border-indigo-500">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Reviews</h2>
            <p className="text-sm text-slate-600 mt-1">
              All package reviews and ratings
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Helpful
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
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-50 rounded-full">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {r.user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">
                          {r.package.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{r.title}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                        <span className="text-sm font-semibold text-slate-900">
                          {r.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">
                          {r.helpfulVotes}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReviewId(r._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalReviews || 0}
        />

        {/* View Review Modal */}
        {selectedReviewId && SingleReview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedReviewId("");
            }}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Review Details</h2>
                <button
                  onClick={() => setSelectedReviewId("")}
                  className="p-2 hover:bg-slate-200 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {/* Review Header Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {SingleReview.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < SingleReview.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-slate-700 ml-1">
                        {SingleReview.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded-full">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-700">{SingleReview.user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>{SingleReview.package.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>
                        {new Date(SingleReview.createdAt as any).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {SingleReview.helpfulVotes !== undefined && (
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-slate-500" />
                        <span>{SingleReview.helpfulVotes} helpful</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {SingleReview.review}
                  </p>
                </div>

                {/* Review Images */}
                {SingleReview.images && SingleReview.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SingleReview.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Review image ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Comment Section */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Admin Comment
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Add or edit a comment for this review. This will be visible to administrators only.
                    </p>
                    <textarea
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[120px]"
                      placeholder="Enter admin comment..."
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSaveComment}
                      disabled={updateCommentMutation.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md transition font-medium text-sm"
                    >
                      <Save className="w-4 h-4" />
                      {updateCommentMutation.isPending ? "Saving..." : "Save Comment"}
                    </button>
                    <button
                      onClick={() => handleDelete(SingleReview._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition font-medium text-sm"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
