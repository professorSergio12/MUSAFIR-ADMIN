import { MapPin, Calendar, Globe } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Locations";
import { useGetAllLocation } from "../../hooks/Locations";
import { useEffect, useState } from "react";

// Sample static data
const sampleLocations = [
  {
    _id: "1",
    name: "Gateway of India",
    country: "India",
    city: "Mumbai",
    details:
      "Historical arch landmark facing the Arabian Sea. Popular tourist site.",
    locationImage: "",
    day: 1,
  },
  {
    _id: "2",
    name: "Marine Drive",
    country: "India",
    city: "Mumbai",
    details:
      "Scenic boulevard along the coast, known as the Queen's Necklace.",
    locationImage: "",
    day: 2,
  },
  {
    _id: "3",
    name: "Burj Khalifa",
    country: "UAE",
    city: "Dubai",
    details: "World's tallest building with incredible skyline view.",
    locationImage: "",
    day: 1,
  },
];

export default function ItineraryCards() {
  const [maxDays, setMaxDays] = useState(0);
  useGetAllLocation();
  const { AllLocation, totalItinerary } = useSelector((state: RootState) => state.Locations);

  // Unique Country List
  const countries = AllLocation.length > 0
    ? [...new Set(AllLocation.map((l) => l.country))]
    : [...new Set(sampleLocations.map((l) => l.country))];

  // Calculate maxDays from AllLocation
  useEffect(() => {
    if (AllLocation.length > 0) {
      const max = Math.max(...AllLocation.map((l) => l.day));
      setMaxDays(max);
    } else {
      const max = Math.max(...sampleLocations.map((l) => l.day));
      setMaxDays(max);
    }
  }, [AllLocation]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <MapPin className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Total Locations</p>
        <p className="text-2xl font-bold text-slate-900">
          {totalItinerary || 0}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Globe className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Unique Countries</p>
        <p className="text-2xl font-bold text-slate-900">
          {countries.length}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-1">Max Days</p>
        <p className="text-2xl font-bold text-slate-900">
          {maxDays}
        </p>
      </div>
    </div>
  );
}

