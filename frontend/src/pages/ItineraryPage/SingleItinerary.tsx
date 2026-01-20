import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ArrowLeft,
  Calendar,
  Globe,
  FileText,
  Info,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/Locations";
import { setSingleLocation } from "../../redux/Locations";
import { useUpdateItinerary } from "../../hooks/Locations";

interface SingleItineraryProps {
  onClose: () => void;
}

const SingleItinerary = ({ onClose }: SingleItineraryProps) => {
  const dispatch = useDispatch();
  const { SingleLocation: singleLocationData } = useSelector((state: RootState) => state.Locations);
  const updateItineraryMutation = useUpdateItinerary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: singleLocationData?.name || '',
    city: singleLocationData?.city || '',
    country: singleLocationData?.country || '',
    day: singleLocationData?.day || 1,
    locationImage: singleLocationData?.locationImage || '',
    imagePreview: singleLocationData?.locationImage || '',
    details: singleLocationData?.details || '',
  });

  // Update form data when SingleLocation changes
  useEffect(() => {
    if (singleLocationData) {
      setFormData({
        name: singleLocationData.name || '',
        city: singleLocationData.city || '',
        country: singleLocationData.country || '',
        day: singleLocationData.day || 1,
        locationImage: singleLocationData.locationImage || '',
        imagePreview: singleLocationData.locationImage || '',
        details: singleLocationData.details || '',
      });
    }
  }, [singleLocationData]);

  const handleClose = () => {
    dispatch(setSingleLocation(null));
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (singleLocationData) {
      // Clean up object URL if a new file was selected
      if (formData.locationImage instanceof File && formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      setFormData({
        name: singleLocationData.name || '',
        city: singleLocationData.city || '',
        country: singleLocationData.country || '',
        day: singleLocationData.day || 1,
        locationImage: singleLocationData.locationImage || '',
        imagePreview: singleLocationData.locationImage || '',
        details: singleLocationData.details || '',
      });
    }
  };

  const handleSave = async () => {
    if (!singleLocationData?._id) {
      console.error("Location ID is missing");
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("day", String(formData.day));
    formDataToSend.append("details", formData.details);
    
    // Send new file if selected, otherwise backend will keep existing image
    if (formData.locationImage instanceof File) {
      formDataToSend.append("locationImage", formData.locationImage);
    }
    
    try {
      const result = await updateItineraryMutation.mutateAsync({
        id: singleLocationData._id,
        formData: formDataToSend,
      });
      
      if (result) {
        setIsEditing(false);
        // Clean up object URL if a new file was uploaded
        if (formData.locationImage instanceof File && formData.imagePreview) {
          URL.revokeObjectURL(formData.imagePreview);
        }
        console.log("Location updated successfully");
      }
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        locationImage: file,
        imagePreview: preview
      }));
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (formData.imagePreview && formData.locationImage instanceof File) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(prev => ({
      ...prev,
      locationImage: '',
      imagePreview: ''
    }));
  };

  if (!singleLocationData) {
    return null;
  }

  const displayData = isEditing ? formData : singleLocationData;

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
              <span className="text-sm font-medium">Back to Itinerary</span>
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
                  disabled={updateItineraryMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateItineraryMutation.isPending ? (
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
      <div className="max-w-8xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-3">
            {/* Location Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Location Information</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Location Name</p>
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
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
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
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Image</p>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            {formData.imagePreview ? (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={formData.imagePreview} 
                                  alt="Location Preview" 
                                  className="w-20 h-20 rounded-lg object-cover border border-slate-200" 
                                />
                                <div className="flex-1">
                                  <p className="text-xs text-slate-600">
                                    {formData.locationImage instanceof File ? formData.locationImage.name : 'Existing Image'}
                                  </p>
                                  {formData.locationImage instanceof File && (
                                    <p className="text-xs text-slate-400">
                                      {formData.locationImage.size > 1024 * 1024
                                        ? `${(formData.locationImage.size / (1024 * 1024)).toFixed(2)} MB`
                                        : `${(formData.locationImage.size / 1024).toFixed(2)} KB`}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={handleRemoveImage}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={handleAddImage}
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
                              >
                                + Add Image
                              </button>
                            )}
                          </div>
                        ) : (
                          displayData.locationImage && (
                            <div className="flex-shrink-0 mt-2">
                              <img 
                                src={displayData.locationImage.toString()} 
                                alt="Location" 
                                className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditing && displayData.locationImage && (
                    <div className="flex-shrink-0">
                      <img 
                        src={displayData.locationImage.toString()} 
                        alt="Location" 
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Day Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Schedule</h2>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Day Number</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.day}
                        onChange={(e) => handleInputChange('day', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600">{displayData.day}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Day {displayData.day}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Info className="w-4 h-4 text-amber-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Location Details</h2>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <textarea
                      value={formData.details}
                      onChange={(e) => handleInputChange('details', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter location details"
                    />
                  ) : (
                    displayData.details ? (
                      <p className="text-xs text-slate-700 leading-relaxed">{displayData.details}</p>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No details provided</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Location Summary */}
          <div>
            {/* Location Summary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Location Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Day</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.day}
                        onChange={(e) => handleInputChange('day', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 text-base font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-base font-bold text-indigo-600">{displayData.day}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Day {displayData.day}</p>
                      </div>
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
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
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
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Has Details</p>
                    <p className="text-xs text-slate-700 font-semibold">{displayData.details ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItinerary;
