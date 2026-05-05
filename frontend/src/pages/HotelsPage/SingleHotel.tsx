import { useState, useEffect, useRef } from "react";
import {
  Hotel,
  ArrowLeft,
  MapPin,
  DollarSign,
  BedDouble,
  Globe,
  FileText,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/HotelSlice";
import { setSingleHotel } from "../../redux/HotelSlice";
import { useUpdateHotel } from "../../hooks/Hotels";

interface SingleHotelProps {
  onClose: () => void;
}

const SingleHotel = ({ onClose }: SingleHotelProps) => {
  const dispatch = useDispatch();
  const { SingleHotel: singleHotelData } = useSelector((state: RootState) => state.Hotels);
  const updateHotelMutation = useUpdateHotel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: singleHotelData?.name || '',
    city: singleHotelData?.city || '',
    country: singleHotelData?.country || '',
    tier: singleHotelData?.tier || 'Standard',
    pricePerNight: singleHotelData?.pricePerNight || 0,
    description: singleHotelData?.description || '',
    images: [] as (string | File)[],
    imagePreviews: [] as string[],
    roomTypes: singleHotelData?.roomTypes || [],
  });

  // Update form data when SingleHotel changes
  useEffect(() => {
    if (singleHotelData) {
      const existingImages = singleHotelData.images || [];
      setFormData({
        name: singleHotelData.name || '',
        city: singleHotelData.city || '',
        country: singleHotelData.country || '',
        tier: singleHotelData.tier || 'Standard',
        pricePerNight: singleHotelData.pricePerNight || 0,
        description: singleHotelData.description || '',
        images: existingImages, // Store as URLs initially
        imagePreviews: existingImages, // Use URLs as previews for existing images
        roomTypes: singleHotelData.roomTypes || [],
      });
    }
  }, [singleHotelData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClose = () => {
    dispatch(setSingleHotel(null));
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (singleHotelData) {
      const existingImages = singleHotelData.images || [];
      // Clean up any object URLs that were created for new files
      formData.imagePreviews.forEach((preview, index) => {
        if (formData.images[index] instanceof File) {
          URL.revokeObjectURL(preview);
        }
      });
      setFormData({
        name: singleHotelData.name || '',
        city: singleHotelData.city || '',
        country: singleHotelData.country || '',
        tier: singleHotelData.tier || 'Standard',
        pricePerNight: singleHotelData.pricePerNight || 0,
        description: singleHotelData.description || '',
        images: existingImages,
        imagePreviews: existingImages,
        roomTypes: singleHotelData.roomTypes || [],
      });
    }
  };

  const handleSave = async () => {
    console.log('Saving hotel:', formData);
    if (!singleHotelData?._id) {
      console.error("Hotel ID is missing");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("tier", formData.tier);
    formDataToSend.append("pricePerNight", String(formData.pricePerNight));
    formDataToSend.append("description", formData.description);
    formDataToSend.append("roomTypes", JSON.stringify(formData.roomTypes));
    
    // Separate existing URLs and new File objects
    const existingImageUrls: string[] = [];
    const newFiles: File[] = [];
    
    formData.images.forEach((image) => {
      if (typeof image === 'string') {
        // Existing image URL
        existingImageUrls.push(image);
      } else if (image instanceof File) {
        // New file to upload
        newFiles.push(image);
      }
    });
    
    // Send existing image URLs (so backend knows which to keep)
    formDataToSend.append(
      "images",
      JSON.stringify(existingImageUrls)
    );
    
    // Send new files
    newFiles.forEach((file) => {
      formDataToSend.append("files", file);
    });
    
    try {
      const result = await updateHotelMutation.mutateAsync({
        id: singleHotelData._id,
        formData: formDataToSend,
      });
      
      if (result) {
        setIsEditing(false);
        // Clean up object URLs for new files
        formData.imagePreviews.forEach((preview, index) => {
          if (formData.images[index] instanceof File) {
            URL.revokeObjectURL(preview);
          }
        });
        console.log("Hotel updated successfully");
      }
    } catch (error) {
      console.error("Failed to update hotel:", error);
      // Show error message to user (you can add a toast notification here)
    }
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
      roomTypes: [...prev.roomTypes, { name: '', surcharge: 0 }]
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
      // Revoke the object URL if it's a File object
      if (prev.images[index] instanceof File) {
        URL.revokeObjectURL(prev.imagePreviews[index]);
      }
      
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
      };
    });
  };

  if (!singleHotelData) {
    return null;
  }

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

  const displayData = isEditing ? formData : singleHotelData;
  // Get images for display - use previews when editing, URLs when viewing
  const displayImages = isEditing 
    ? formData.imagePreviews 
    : (singleHotelData?.images || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-2 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Hotels</span>
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
                  disabled={updateHotelMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateHotelMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-4">
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
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">City</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            displayData.city && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-xs text-slate-700">{displayData.city}</p>
                              </div>
                            )
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Country</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            displayData.country && (
                              <div className="flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-xs text-slate-700">{displayData.country}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tier</p>
                        {isEditing ? (
                          <select
                            value={formData.tier}
                            onChange={(e) => handleInputChange('tier', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="Budget">Budget</option>
                            <option value="Standard">Standard</option>
                            <option value="Luxury">Luxury</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getTierColor(displayData.tier)}`}>
                            {displayData.tier}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditing && displayImages && displayImages.length > 0 && (
                    <div className="flex-shrink-0">
                      <img 
                        src={displayImages[0]} 
                        alt="Hotel" 
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                      />
                    </div>
                  )}
                </div>
                {displayData.description && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</p>
                    {isEditing ? (
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        placeholder="Enter hotel description"
                      />
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed">{displayData.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Pricing</h2>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Base Price Per Night</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-base font-bold text-indigo-600">{formatCurrency(displayData.pricePerNight)}</p>
                    )}
                  </div>
                </div>
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
                  {isEditing && (
                    <button
                      onClick={handleAddRoomType}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Room
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {formData.roomTypes.map((room, index) => (
                      <div key={index} className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={room.name}
                            onChange={(e) => handleRoomTypeChange(index, 'name', e.target.value)}
                            placeholder="Room name"
                            className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
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
                ) : (
                  displayData.roomTypes && displayData.roomTypes.length > 0 ? (
                    <div className="space-y-2">
                      {displayData.roomTypes.slice(0, 5).map((room, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded border border-slate-100">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900">{room.name}</p>
                            <p className="text-xs font-medium text-indigo-600">+{formatCurrency(room.surcharge)}</p>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">Additional surcharge per night</p>
                        </div>
                      ))}
                      {displayData.roomTypes.length > 5 && (
                        <p className="text-xs text-slate-500 font-medium">+{displayData.roomTypes.length - 5} more room types</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No room types</p>
                  )
                )}
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
                  {isEditing && (
                    <button
                      onClick={handleAddImage}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Image
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <div className="space-y-2">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <img 
                            src={preview} 
                            alt={`Hotel ${index + 1}`} 
                            className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-600 truncate">
                              {formData.images[index] instanceof File 
                                ? formData.images[index].name 
                                : 'Existing Image'}
                            </p>
                            {formData.images[index] instanceof File && (
                              <p className="text-xs text-slate-400">
                                {(formData.images[index] as File).size > 1024 * 1024
                                  ? `${((formData.images[index] as File).size / (1024 * 1024)).toFixed(2)} MB`
                                  : `${((formData.images[index] as File).size / 1024).toFixed(2)} KB`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {formData.imagePreviews.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4">No images. Click "Add Image" to add one.</p>
                      )}
                    </div>
                  </>
                ) : (
                  displayImages && displayImages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {displayImages.slice(0, 4).map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Hotel ${index + 1}`} 
                            className="w-full h-32 rounded-lg object-cover border border-slate-200" 
                          />
                        ))}
                      </div>
                      {displayImages.length > 4 && (
                        <p className="text-xs text-slate-500 font-medium mt-2">+{displayImages.length - 4} more images</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">No images</p>
                  )
                )}
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
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                        className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-xl font-bold text-indigo-600">{formatCurrency(displayData.pricePerNight)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">City</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        displayData.city && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-700">{displayData.city}</p>
                          </div>
                        )
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Country</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        displayData.country && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs text-slate-700">{displayData.country}</p>
                          </div>
                        )
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tier</p>
                      {isEditing ? (
                        <select
                          value={formData.tier}
                          onChange={(e) => handleInputChange('tier', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="Budget">Budget</option>
                          <option value="Standard">Standard</option>
                          <option value="Luxury">Luxury</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border w-full justify-center ${getTierColor(displayData.tier)}`}>
                          {displayData.tier}
                        </div>
                      )}
                    </div>
                  </div>

                  {displayData.roomTypes && displayData.roomTypes.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Available Rooms</p>
                      <p className="text-xs text-slate-700 font-semibold">{displayData.roomTypes.length} room type{displayData.roomTypes.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHotel;
