import { useState, useRef } from "react";
import {
  Package,
  ArrowLeft,
  MapPin,
  Hotel,
  UtensilsCrossed,
  FileText,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { useGetAllLocation } from "../../hooks/Locations";
import { useGetAllFoods } from "../../hooks/FoodOptions";
import { useSelector } from "react-redux";
import type { RootState as HotelRootState } from "../../redux/HotelSlice";
import type { RootState as LocationRootState } from "../../redux/Locations";
import type { RootState as FoodRootState } from "../../redux/FoodOption";
import { createPackageAPI } from "../../api/Packages";
import type { AllItneraryTypes } from "../../types";
import type { FoodOptionsByIdTypes } from "../../types";
import EntityPicker from "../../components/EntityPicker";
import type { AllHotelsType } from "../../types";
import { fetchHotelPicker } from "../../api/Hotels";
import { fetchItineraryPicker } from "../../api/Locations";
import { fetchFoodPicker } from "../../api/FoodOptions";

interface CreatePackageProps {
  onClose: () => void;
}

export default function CreatePackage({ onClose }: CreatePackageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all available options for selection
  useGetAllLocation();
  useGetAllFoods();
  
  const { AllHotels } = useSelector((state: HotelRootState) => state.Hotels);
  const { AllLocation } = useSelector((state: LocationRootState) => state.Locations);
  const { AllFoods } = useSelector((state: FoodRootState) => state.FoodOptions);
  
  const [formData, setFormData] = useState({
    name: '',
    basePrice: 0,
    durationDays: 0,
    bestSeason: 'all',
    description: '',
    country: '',
    image: null as File | null,
    imagePreview: '' as string,
    isRecommended: false,
    availableHotels: [] as string[],
    itinerary: [] as string[],
    availableFoodOptions: [] as string[],
  });

  // Modal states for searchable dropdowns
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleSelection = (type: 'hotels' | 'itinerary' | 'foodOptions', id: string) => {
    if (type === 'hotels') {
      setFormData(prev => {
        const isSelected = prev.availableHotels.includes(id);
        return {
          ...prev,
          availableHotels: isSelected
            ? prev.availableHotels.filter(item => item !== id)
            : [...prev.availableHotels, id]
        };
      });
    } else if (type === 'itinerary') {
      setFormData(prev => {
        const isSelected = prev.itinerary.includes(id);
        return {
          ...prev,
          itinerary: isSelected
            ? prev.itinerary.filter(item => item !== id)
            : [...prev.itinerary, id]
        };
      });
    } else if (type === 'foodOptions') {
      setFormData(prev => {
        const isSelected = prev.availableFoodOptions.includes(id);
        return {
          ...prev,
          availableFoodOptions: isSelected
            ? prev.availableFoodOptions.filter(item => item !== id)
            : [...prev.availableFoodOptions, id]
        };
      });
    }
  };

  const handleConfirmHotels = (selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      availableHotels: selectedIds
    }));
  };

  const handleConfirmItinerary = (selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      itinerary: selectedIds
    }));
  };

  const handleConfirmFoodOptions = (selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      availableFoodOptions: selectedIds
    }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData(prev => {
        // Clean up previous preview if exists
        if (prev.imagePreview) {
          URL.revokeObjectURL(prev.imagePreview);
        }
        return {
          ...prev,
          image: file,
          imagePreview: preview
        };
      });
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("basePrice", String(formData.basePrice));
      fd.append("durationDays", String(formData.durationDays));
      fd.append("bestSeason", formData.bestSeason);
      fd.append("country", formData.country);
      fd.append("isRecommended", String(formData.isRecommended));

      // Arrays as JSON strings (backend parses JSON.parse)
      fd.append("itinerary", JSON.stringify(formData.itinerary));
      fd.append("availableHotels", JSON.stringify(formData.availableHotels));
      fd.append(
        "availableFoodOptions",
        JSON.stringify(formData.availableFoodOptions)
      );

      // Image file upload
      if (formData.image) {
        fd.append("image", formData.image);
      }

      const res = await createPackageAPI(fd);

      if (res) {
        console.log("Package created successfully:", res);
        // Clean up object URL
        if (formData.imagePreview) {
          URL.revokeObjectURL(formData.imagePreview);
        }
        onClose();
      } else {
        console.error("Failed to create package");
      }
    } catch (error) {
      console.error("Create package error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Packages</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              Create Package
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-3">
            {/* Package Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Package Information</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Package Name</p>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter package name"
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Base Price</p>
                          <input
                            type="number"
                            value={formData.basePrice}
                            onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Duration (Days)</p>
                          <input
                            type="number"
                            value={formData.durationDays}
                            onChange={(e) => handleInputChange('durationDays', Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Country</p>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          placeholder="Enter country"
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Best Season</p>
                        <select
                          value={formData.bestSeason}
                          onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="winter">Winter</option>
                          <option value="summer">Summer</option>
                          <option value="monsoon">Monsoon</option>
                          <option value="all">All</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Recommended</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isRecommended}
                            onChange={(e) => handleInputChange('isRecommended', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-xs text-slate-700">Mark as recommended</span>
                        </label>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Image</p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="space-y-2">
                          {formData.imagePreview ? (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <img 
                                src={formData.imagePreview} 
                                alt="Preview" 
                                className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" 
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-600 truncate">
                                  {formData.image?.name || 'Image Preview'}
                                </p>
                                {formData.image && (
                                  <p className="text-xs text-slate-400">
                                    {formData.image.size > 1024 * 1024
                                      ? `${(formData.image.size / (1024 * 1024)).toFixed(2)} MB`
                                      : `${(formData.image.size / 1024).toFixed(2)} KB`}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={handleRemoveImage}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={handleAddImage}
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 flex items-center justify-center gap-2"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Image
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    placeholder="Enter package description"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Hotels Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Hotel className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Available Hotels</h2>
                  </div>
                  <button
                    onClick={() => setShowHotelModal(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Hotel
                  </button>
                </div>
                {formData.availableHotels.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AllHotels
                      .filter(hotel => formData.availableHotels.includes(hotel._id))
                      .map((hotel) => (
                        <div
                          key={hotel._id}
                          className="flex items-center gap-3 p-2 rounded border bg-indigo-50 border-indigo-200"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900">{hotel.name}</p>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-xs text-slate-600">{hotel.tier || 'Standard'}</p>
                              <p className="text-xs font-medium text-indigo-600">{formatCurrency(hotel.pricePerNight)}/night</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleSelection('hotels', hotel._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No hotels selected. Click "Add Hotel" to add hotels.</p>
                )}
              </div>
            </div>

            {/* Itinerary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Travel Itinerary</h2>
                  </div>
                  <button
                    onClick={() => setShowItineraryModal(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Location
                  </button>
                </div>
                {formData.itinerary.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AllLocation
                      .filter(location => formData.itinerary.includes(location._id))
                      .map((location) => (
                        <div
                          key={location._id}
                          className="flex items-center gap-3 p-2 rounded border bg-indigo-50 border-indigo-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-indigo-600">{location.day}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-900">{location.name}</p>
                            </div>
                            {(location.city || location.country) && (
                              <p className="text-xs text-slate-600 ml-8 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {[location.city, location.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleToggleSelection('itinerary', location._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No locations selected. Click "Add Location" to add locations.</p>
                )}
              </div>
            </div>

            {/* Food Options Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 rounded-lg">
                      <UtensilsCrossed className="w-4 h-4 text-rose-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Available Meal Plans</h2>
                  </div>
                  <button
                    onClick={() => setShowFoodModal(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Meal Plan
                  </button>
                </div>
                {formData.availableFoodOptions.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AllFoods
                      .filter(food => formData.availableFoodOptions.includes(food._id))
                      .map((food) => (
                        <div
                          key={food._id}
                          className="flex items-center gap-3 p-2 rounded border bg-indigo-50 border-indigo-200"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900">{food.name}</p>
                            <p className="text-xs text-slate-600">Surcharge: <span className="font-medium text-indigo-600">{formatCurrency(food.surchargePerDay)}/day</span></p>
                          </div>
                          <button
                            onClick={() => handleToggleSelection('foodOptions', food._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No meal plans selected. Click "Add Meal Plan" to add meal plans.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Package Summary */}
          <div>
            {/* Package Summary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Package Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Base Price</p>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                      className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Duration</p>
                      <input
                        type="number"
                        value={formData.durationDays}
                        onChange={(e) => handleInputChange('durationDays', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Best Season</p>
                      <select
                        value={formData.bestSeason}
                        onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="winter">Winter</option>
                        <option value="summer">Summer</option>
                        <option value="monsoon">Monsoon</option>
                        <option value="all">All</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Package Status</p>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.isRecommended}
                        onChange={(e) => handleInputChange('isRecommended', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs font-medium text-slate-700">Recommended</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Selected Items</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600">
                        Hotels: <span className="font-medium text-indigo-600">{formData.availableHotels.length}</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        Locations: <span className="font-medium text-indigo-600">{formData.itinerary.length}</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        Meal Plans: <span className="font-medium text-indigo-600">{formData.availableFoodOptions.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Picker Modals (API based) */}
      <EntityPicker<AllHotelsType>
        isOpen={showHotelModal}
        onClose={() => setShowHotelModal(false)}
        selectedItems={formData.availableHotels}
        onConfirm={handleConfirmHotels}
        title="Select Hotels"
        searchPlaceholder="Search hotels by name, city, country..."
        queryKeyBase="hotels"
        fetcher={(q) => fetchHotelPicker(q, 50)}
        getItemId={(hotel) => hotel._id}
        getItemDisplay={(hotel) => hotel.name}
        getItemSubtext={(hotel) =>
          `${hotel.tier || "Standard"} • ${formatCurrency(hotel.pricePerNight)}/night`
        }
      />

      <EntityPicker<AllItneraryTypes>
        isOpen={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
        selectedItems={formData.itinerary}
        onConfirm={handleConfirmItinerary}
        title="Select Itinerary Locations"
        searchPlaceholder="Search locations by name, city, country..."
        queryKeyBase="itineraries"
        fetcher={(q) => fetchItineraryPicker(q, 50)}
        getItemId={(location) => location._id}
        getItemDisplay={(location) => location.name}
        getItemSubtext={(location) =>
          `Day ${location.day} • ${
            [location.city, location.country].filter(Boolean).join(", ") || "No location"
          }`
        }
      />

      <EntityPicker<FoodOptionsByIdTypes>
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        selectedItems={formData.availableFoodOptions}
        onConfirm={handleConfirmFoodOptions}
        title="Select Meal Plans"
        searchPlaceholder="Search meal plans by name..."
        queryKeyBase="foods"
        fetcher={(q) => fetchFoodPicker(q, 50)}
        getItemId={(food) => food._id}
        getItemDisplay={(food) => food.name}
        getItemSubtext={(food) => `Surcharge: ${formatCurrency(food.surchargePerDay)}/day`}
      />
    </div>
  );
}

