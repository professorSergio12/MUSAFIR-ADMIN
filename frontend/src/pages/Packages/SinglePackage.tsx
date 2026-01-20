import { useState, useEffect } from "react";
import {
  Package,
  ArrowLeft,
  MapPin,
  Hotel,
  UtensilsCrossed,
  Calendar,
  Star,
  Globe,
  FileText,
  CheckCircle2,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/packagesSlice";
import { setSinglePackage } from "../../redux/packagesSlice";
import { useGetAllHotels } from "../../hooks/Hotels";
import { useGetAllLocation } from "../../hooks/Locations";
import { useGetAllFoods } from "../../hooks/FoodOptions";
import type { RootState as HotelRootState } from "../../redux/HotelSlice";
import type { RootState as LocationRootState } from "../../redux/Locations";
import type { RootState as FoodRootState } from "../../redux/FoodOption";
import EntityPicker from "../../components/EntityPicker";
import type { AllHotelsType } from "../../types";
import type { AllItneraryTypes } from "../../types";
import type { FoodOptionsByIdTypes } from "../../types";
import { fetchHotelPicker } from "../../api/Hotels";
import { fetchItineraryPicker } from "../../api/Locations";
import { fetchFoodPicker } from "../../api/FoodOptions";

interface SinglePackageProps {
  onClose: () => void;
}

const SinglePackage = ({ onClose }: SinglePackageProps) => {
  const dispatch = useDispatch();
  const { SinglePackage: singlePackageData } = useSelector((state: RootState) => state.Packages);
  
  // Fetch all available options for selection
  useGetAllHotels();
  useGetAllLocation();
  useGetAllFoods();
  
  const { AllHotels } = useSelector((state: HotelRootState) => state.Hotels);
  const { AllLocation } = useSelector((state: LocationRootState) => state.Locations);
  const { AllFoods } = useSelector((state: FoodRootState) => state.FoodOptions);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: singlePackageData?.name || '',
    basePrice: singlePackageData?.basePrice || 0,
    durdurationDays: singlePackageData?.durdurationDays || 0,
    bestSeason: singlePackageData?.bestSeason || 'all',
    description: singlePackageData?.description || '',
    images: singlePackageData?.images || '',
    isRecommended: singlePackageData?.isRecommended || false,
    availableHotels: singlePackageData?.availableHotels?.map(h => h._id) || [],
    itinerary: singlePackageData?.itinerary?.map(i => i._id) || [],
    availableFoodOptions: singlePackageData?.availableFoodOptions?.map(f => f._id) || [],
  });

  // Modal states for searchable dropdowns
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  // Update form data when SinglePackage changes
  useEffect(() => {
    if (singlePackageData) {
      setFormData({
        name: singlePackageData.name || '',
        basePrice: singlePackageData.basePrice || 0,
        durdurationDays: singlePackageData.durdurationDays || 0,
        bestSeason: singlePackageData.bestSeason || 'all',
        description: singlePackageData.description || '',
        images: singlePackageData.images || '',
        isRecommended: singlePackageData.isRecommended || false,
        availableHotels: singlePackageData.availableHotels?.map(h => h._id) || [],
        itinerary: singlePackageData.itinerary?.map(i => i._id) || [],
        availableFoodOptions: singlePackageData.availableFoodOptions?.map(f => f._id) || [],
      });
    }
  }, [singlePackageData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClose = () => {
    dispatch(setSinglePackage(null));
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (singlePackageData) {
      setFormData({
        name: singlePackageData.name || '',
        basePrice: singlePackageData.basePrice || 0,
        durdurationDays: singlePackageData.durdurationDays || 0,
        bestSeason: singlePackageData.bestSeason || 'all',
        description: singlePackageData.description || '',
        images: singlePackageData.images || '',
        isRecommended: singlePackageData.isRecommended || false,
        availableHotels: singlePackageData.availableHotels?.map(h => h._id) || [],
        itinerary: singlePackageData.itinerary?.map(i => i._id) || [],
        availableFoodOptions: singlePackageData.availableFoodOptions?.map(f => f._id) || [],
      });
    }
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

  const handleSave = () => {
    // TODO: Add API call to save the package
    console.log('Saving package:', formData);
    setIsEditing(false);
    // Here you would typically dispatch an action to update the package via API
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!singlePackageData) {
    return null;
  }

  const displayData = isEditing ? formData : singlePackageData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Packages</span>
            </button>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
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
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-900">{displayData.name || '-'}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Base Price</p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={formData.basePrice}
                              onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-base font-bold text-indigo-600">{formatCurrency(displayData.basePrice || 0)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Duration</p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={formData.durdurationDays}
                              onChange={(e) => handleInputChange('durdurationDays', Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-xs font-medium text-slate-700">{displayData.durdurationDays || 0} days</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Best Season</p>
                        {isEditing ? (
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
                        ) : (
                          displayData.bestSeason && (
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-xs text-slate-700 capitalize">{displayData.bestSeason}</p>
                            </div>
                          )
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Recommended</p>
                        {isEditing ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isRecommended}
                              onChange={(e) => handleInputChange('isRecommended', e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-700">Mark as recommended</span>
                          </label>
                        ) : (
                          displayData.isRecommended && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <Star className="w-3.5 h-3.5 fill-indigo-600" />
                              <span className="text-xs font-medium">Recommended</span>
                            </div>
                          )
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Image URL</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.images}
                            onChange={(e) => handleInputChange('images', e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          displayData.images && (
                            <div className="flex-shrink-0 mt-2">
                              <img 
                                src={displayData.images} 
                                alt="Package" 
                                className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditing && displayData.images && (
                    <div className="flex-shrink-0">
                      <img 
                        src={displayData.images} 
                        alt="Package" 
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter package description"
                    />
                  ) : (
                    displayData.description && (
                      <p className="text-xs text-slate-700 leading-relaxed">{displayData.description}</p>
                    )
                  )}
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
                  {isEditing && (
                    <button
                      onClick={() => setShowHotelModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Hotel
                    </button>
                  )}
                </div>
                {isEditing ? (
                  formData.availableHotels.length > 0 ? (
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
                  )
                ) : (
                  singlePackageData.availableHotels && singlePackageData.availableHotels.length > 0 ? (
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        {singlePackageData.availableHotels.slice(0, 3).map((hotel) => (
                          <div key={hotel._id} className="p-2 bg-slate-50 rounded border border-slate-100">
                            <p className="text-xs font-semibold text-slate-900 mb-0.5">{hotel.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-600">{hotel.tier || 'Standard'}</p>
                              <p className="text-xs font-medium text-indigo-600">{formatCurrency(hotel.pricePerNight)}/night</p>
                            </div>
                          </div>
                        ))}
                        {singlePackageData.availableHotels.length > 3 && (
                          <p className="text-xs text-slate-500 font-medium">+{singlePackageData.availableHotels.length - 3} more hotels</p>
                        )}
                      </div>
                      {singlePackageData.availableHotels[0]?.images && singlePackageData.availableHotels[0].images.length > 0 && (
                        <div className="flex-shrink-0">
                          <img 
                            src={singlePackageData.availableHotels[0].images[0]} 
                            alt="Hotel" 
                            className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No hotels selected</p>
                  )
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
                  {isEditing && (
                    <button
                      onClick={() => setShowItineraryModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Location
                    </button>
                  )}
                </div>
                {isEditing ? (
                  formData.itinerary.length > 0 ? (
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
                  )
                ) : (
                  singlePackageData.itinerary && singlePackageData.itinerary.length > 0 ? (
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        {singlePackageData.itinerary.slice(0, 3).map((item) => (
                          <div key={item._id} className="p-2 bg-slate-50 rounded border border-slate-100">
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-indigo-600">{item.day}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-900 mb-0.5">{item.name || '-'}</p>
                                {(item.city || item.country) && (
                                  <p className="text-xs text-slate-600 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[item.city, item.country].filter(Boolean).join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {singlePackageData.itinerary.length > 3 && (
                          <p className="text-xs text-slate-500 font-medium">+{singlePackageData.itinerary.length - 3} more locations</p>
                        )}
                      </div>
                      {singlePackageData.itinerary[0]?.locationImage && (
                        <div className="flex-shrink-0">
                          <img 
                            src={singlePackageData.itinerary[0].locationImage.toString()} 
                            alt="Location" 
                            className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No locations selected</p>
                  )
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
                  {isEditing && (
                    <button
                      onClick={() => setShowFoodModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Meal Plan
                    </button>
                  )}
                </div>
                {isEditing ? (
                  formData.availableFoodOptions.length > 0 ? (
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
                  )
                ) : (
                  singlePackageData.availableFoodOptions && singlePackageData.availableFoodOptions.length > 0 ? (
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        {singlePackageData.availableFoodOptions.slice(0, 3).map((food) => (
                          <div key={food._id} className="p-2 bg-slate-50 rounded border border-slate-100">
                            <p className="text-xs font-semibold text-slate-900 mb-0.5">{food.name}</p>
                            <p className="text-xs text-slate-600">Surcharge: <span className="font-medium text-indigo-600">{formatCurrency(food.surchargePerDay)}/day</span></p>
                          </div>
                        ))}
                        {singlePackageData.availableFoodOptions.length > 3 && (
                          <p className="text-xs text-slate-500 font-medium">+{singlePackageData.availableFoodOptions.length - 3} more options</p>
                        )}
                      </div>
                      {singlePackageData.availableFoodOptions[0]?.image && (
                        <div className="flex-shrink-0">
                          <img 
                            src={singlePackageData.availableFoodOptions[0].image} 
                            alt="Food" 
                            className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No meal plans selected</p>
                  )
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
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                        className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-xl font-bold text-indigo-600">{formatCurrency(displayData.basePrice || 0)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Duration</p>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.durdurationDays}
                          onChange={(e) => handleInputChange('durdurationDays', Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        displayData.durdurationDays && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-700">{displayData.durdurationDays} days</p>
                          </div>
                        )
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Best Season</p>
                      {isEditing ? (
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
                      ) : (
                        displayData.bestSeason && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-700 capitalize">{displayData.bestSeason}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Package Status</p>
                    {isEditing ? (
                      <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={formData.isRecommended}
                          onChange={(e) => handleInputChange('isRecommended', e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-xs font-medium text-slate-700">Recommended</span>
                      </label>
                    ) : (
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs w-full justify-center ${
                        displayData.isRecommended ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                        "bg-slate-50 text-slate-700 border border-slate-200"
                      }`}>
                        {displayData.isRecommended && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {displayData.isRecommended ? "Recommended" : "Standard"}
                      </div>
                    )}
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
};

export default SinglePackage;
