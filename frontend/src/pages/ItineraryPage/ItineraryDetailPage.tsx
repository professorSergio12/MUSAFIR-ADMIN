import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SingleItinerary from "./SingleItinerary";
import { useGetLocationById } from "../../hooks/Locations";
import type { RootState } from "../../redux/Locations";
import { setSingleLocation } from "../../redux/Locations";

export default function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SingleLocation: location } = useSelector((state: RootState) => state.Locations);

  const { isLoading } = useGetLocationById(id || "", !!id);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setSingleLocation(null));
    };
  }, [dispatch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 text-sm">Invalid itinerary id</p>
          <button
            onClick={() => navigate("/itinerary")}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Itinerary
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !location) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">
            {isLoading ? "Loading itinerary details..." : "Itinerary not found"}
          </p>
          <button
            onClick={() => navigate("/itinerary")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Itinerary
          </button>
        </div>
      </div>
    );
  }

  return <SingleItinerary onClose={() => navigate("/itinerary")} />;
}
