import { Hotel, IndianRupee, Star } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/HotelSlice";
import { useGetAllHotels } from "../../hooks/Hotels";
import { useEffect, useState } from "react";


export default function HotelCards() {
  const [avgPrice, setAvgPrice] = useState(0);
  useGetAllHotels();
  const { AllHotels } = useSelector((state: RootState) => state.Hotels);
  const TotaPrice = AllHotels.length > 0 ? AllHotels.reduce((acc, hotel) => acc + hotel.pricePerNight, 0) : 0;

  useEffect(() => {
    if (AllHotels.length > 0) {
      setAvgPrice(TotaPrice / AllHotels.length);
    }
  }, [AllHotels, TotaPrice]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Hotel className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Total Hotels</p>
        <p className="text-2xl font-bold text-slate-900">
          {AllHotels.length }
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <IndianRupee className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Avg. Price
        <span className="ml-2 text-2xl font-bold text-slate-900">
        {avgPrice.toFixed(2)}
        </span>
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Star className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Avg. Rating</p>
        <p className="text-2xl font-bold text-slate-900">
       show average rating 
        </p>
      </div>
    </div>
  );
}

