import { useState, useRef } from "react";
import {
  Hotel,
  ArrowLeft,
  MapPin,
  BedDouble,
  Globe,
  FileText,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { createHotelAPI } from "../../api/Hotels";

interface CreateHotelProps {
  onClose: () => void;
}

interface RoomType {
  name: string;
  surcharge: number;
}

export default function CreateHotel({ onClose }: CreateHotelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    tier: 'Standard',
    pricePerNight: 0,
    description: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    roomTypes: [] as RoomType[],
  });

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

  const handleRoomTypeChange = (index: number, field: 'name' | 'surcharge', value: string | number) => {
    setFormData(prev => {
      const newRoomTypes = [...prev.roomTypes];
      newRoomTypes[index] = {
        ...newRoomTypes[index],
        [field]: value
      };
      return {
        ...prev,
        roomTypes: newRoomTypes
      };
    });
  };

  const handleAddRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { name: 'Standard Room', surcharge: 0 }]
    }));
  };

  const handleRemoveRoomType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews]
      }));
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev.imagePreviews[index]);
      
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
      };
    });
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
  
      // Basic hotel details
      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("country", formData.country);
      data.append("tier", formData.tier);
      data.append("pricePerNight", String(formData.pricePerNight));
      data.append("description", formData.description);
  
      // Room types (array → JSON string)
      data.append("roomTypes", JSON.stringify(formData.roomTypes));
  
      // Images (multiple files, same key)
      formData.images.forEach((file) => {
        data.append("image", file);
      });

  
      const res = await createHotelAPI(data);
  
      if (res) {
        console.log("Hotel created successfully:", res);
        onClose(); // optional: close modal/page after success
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
    }
  };
  

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Luxury":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Standard":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Budget":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Hotels</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Save Hotel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-3">
            {/* Hotel Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Hotel className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Hotel Information</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Hotel Name</p>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter hotel name"
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">City</p>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Enter city"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
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
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Tier</p>
                        <select
                          value={formData.tier}
                          onChange={(e) => handleInputChange('tier', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="Budget">Budget</option>
                          <option value="Standard">Standard</option>
                          <option value="Luxury">Luxury</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Description</h2>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter hotel description"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Room Types Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <BedDouble className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Room Types</h2>
                  </div>
                  <button
                    onClick={handleAddRoomType}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Room
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.roomTypes.map((room, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={room.name}
                          onChange={(e) => handleRoomTypeChange(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select Room Type</option>
                          <option value="Standard Room">Standard Room</option>
                          <option value="Suite">Suite</option>
                          <option value="Deluxe Room">Deluxe Room</option>
                        </select>
                        <input
                          type="number"
                          value={room.surcharge}
                          onChange={(e) => handleRoomTypeChange(index, 'surcharge', Number(e.target.value))}
                          placeholder="Surcharge"
                          className="w-24 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleRemoveRoomType(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">Surcharge: {formatCurrency(room.surcharge)}</p>
                    </div>
                  ))}
                  {formData.roomTypes.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No room types. Click "Add Room" to add one.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 rounded-lg">
                      <Hotel className="w-4 h-4 text-rose-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Hotel Images</h2>
                  </div>
                  <button
                    onClick={handleAddImage}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  {formData.imagePreviews.map((preview, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <img 
                        src={preview} 
                        alt={`Hotel ${index + 1}`} 
                        className="w-20 h-20 rounded-lg object-cover border border-slate-200" 
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700">{formData.images[index]?.name || 'Image'}</p>
                        <p className="text-xs text-slate-500">
                          {(formData.images[index]?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No images. Click "Add Image" to add one.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hotel Summary */}
          <div>
            {/* Hotel Summary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Hotel Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Price Per Night</p>
                    <input
                      type="number"
                      value={formData.pricePerNight}
                      onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">City</p>
                      {formData.city && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-xs text-slate-700">{formData.city}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Country</p>
                      {formData.country && (
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-xs text-slate-700">{formData.country}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tier</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border w-full justify-center ${getTierColor(formData.tier)}`}>
                        {formData.tier}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
