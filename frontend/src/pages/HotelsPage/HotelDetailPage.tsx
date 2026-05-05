import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SingleHotel from "./SingleHotel";
import { useGetHotelByID } from "../../hooks/Hotels";
import type { RootState } from "../../redux/HotelSlice";
import { setSingleHotel } from "../../redux/HotelSlice";

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SingleHotel: hotel } = useSelector((state: RootState) => state.Hotels);

  const { isLoading } = useGetHotelByID(id || "", !!id);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setSingleHotel(null));
    };
  }, [dispatch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 text-sm">Invalid hotel id</p>
          <button
            onClick={() => navigate("/hotels")}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !hotel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">
            {isLoading ? "Loading hotel details..." : "Hotel not found"}
          </p>
          <button
            onClick={() => navigate("/hotels")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return <SingleHotel onClose={() => navigate("/hotels")} />;
}
