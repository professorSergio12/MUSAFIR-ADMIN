import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SingleFoodOption from "./SingleFoodOption";
import { useGetFoodsById } from "../../hooks/FoodOptions";
import type { RootState } from "../../redux/FoodOption";
import { setSingleFoods } from "../../redux/FoodOption";

export default function FoodOptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SingleFoods: foodOption } = useSelector((state: RootState) => state.FoodOptions);

  const { isLoading } = useGetFoodsById(id || "", !!id);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setSingleFoods(null));
    };
  }, [dispatch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 text-sm">Invalid food option id</p>
          <button
            onClick={() => navigate("/food-options")}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Food Options
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !foodOption) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">
            {isLoading ? "Loading food option details..." : "Food option not found"}
          </p>
          <button
            onClick={() => navigate("/food-options")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Back to Food Options
          </button>
        </div>
      </div>
    );
  }

  return <SingleFoodOption onClose={() => navigate("/food-options")} />;
}
