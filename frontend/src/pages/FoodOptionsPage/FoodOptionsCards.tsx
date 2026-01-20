import { Utensils, DollarSign, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/FoodOption";
import { useGetAllFoods } from "../../hooks/FoodOptions";
import { useEffect, useState } from "react";

// Static sample data
const foodOptions = [
  {
    _id: "1",
    name: "Full Board",
    surchargePerDay: 800,
    foodOptions: [
      { name: "Breakfast", surcharge: 100 },
      { name: "Lunch", surcharge: 150 },
      { name: "Dinner", surcharge: 200 },
    ],
    description: "All meals included per day.",
    image: "",
  },
  {
    _id: "2",
    name: "Half Board",
    surchargePerDay: 400,
    foodOptions: [
      { name: "Breakfast", surcharge: 100 },
      { name: "Dinner", surcharge: 150 },
    ],
    description: "Breakfast and dinner included.",
    image: "",
  },
];

export default function FoodOptionsCards() {
  const [avgSurcharge, setAvgSurcharge] = useState(0);
  useGetAllFoods();
  const { AllFoods } = useSelector((state: RootState) => state.FoodOptions);
  
  const TotalSurcharge = AllFoods.reduce(
    (acc: number, food: any) => acc + food.surchargePerDay,
    0
  );

  useEffect(() => {
    if (AllFoods.length > 0) {
      setAvgSurcharge(TotalSurcharge / AllFoods.length);
    }
  }, [AllFoods.length, TotalSurcharge]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Utensils className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Total Options</p>
        <p className="text-2xl font-bold text-slate-900">
          {AllFoods.length || 0}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Avg. Surcharge / Day</p>
        <p className="text-2xl font-bold text-slate-900">
          {AllFoods.length > 0
            ? formatCurrency(Math.round(avgSurcharge))
            : formatCurrency(
                Math.round(
                  foodOptions.reduce(
                    (a, b) => a + b.surchargePerDay,
                    0
                  ) / foodOptions.length
                )
              )}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Unique Meal Types</p>
        <p className="text-sm font-medium text-slate-900">
          Breakfast, Lunch, Dinner
        </p>
      </div>
    </div>
  );
}

