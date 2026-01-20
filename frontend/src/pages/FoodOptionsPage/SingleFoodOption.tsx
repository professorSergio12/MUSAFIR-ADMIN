import { useState, useEffect, useRef } from "react";
import {
  UtensilsCrossed,
  ArrowLeft,
  DollarSign,
  FileText,
  Coffee,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/FoodOption";
import { setSingleFoods } from "../../redux/FoodOption";
import { useUpdateFoodOption } from "../../hooks/FoodOptions";

interface SingleFoodOptionProps {
  onClose: () => void;
}

interface MealOption {
  name: string;
  surcharge: number;
}

const SingleFoodOption = ({ onClose }: SingleFoodOptionProps) => {
  const dispatch = useDispatch();
  const { SingleFoods: singleFoodData } = useSelector((state: RootState) => state.FoodOptions);
  const updateFoodOptionMutation = useUpdateFoodOption();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: singleFoodData?.name || '',
    surchargePerDay: singleFoodData?.surchargePerDay || 0,
    description: singleFoodData?.description || '',
    image: singleFoodData?.image || '',
    imagePreview: singleFoodData?.image || '',
    foodOptions: singleFoodData?.foodOptions || [],
  });

  // Update form data when SingleFoods changes
  useEffect(() => {
    if (singleFoodData) {
      setFormData({
        name: singleFoodData.name || '',
        surchargePerDay: singleFoodData.surchargePerDay || 0,
        description: singleFoodData.description || '',
        image: singleFoodData.image || '',
        imagePreview: singleFoodData.image || '',
        foodOptions: singleFoodData.foodOptions || [],
      });
    }
  }, [singleFoodData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClose = () => {
    dispatch(setSingleFoods(null));
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (singleFoodData) {
      // Clean up object URL if a new file was selected
      if (formData.image instanceof File && formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      setFormData({
        name: singleFoodData.name || '',
        surchargePerDay: singleFoodData.surchargePerDay || 0,
        description: singleFoodData.description || '',
        image: singleFoodData.image || '',
        imagePreview: singleFoodData.image || '',
        foodOptions: singleFoodData.foodOptions || [],
      });
    }
  };

  const handleSave = async () => {
    if (!singleFoodData?._id) {
      console.error("Food option ID is missing");
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surchargePerDay", String(formData.surchargePerDay));
    formDataToSend.append("description", formData.description);
    formDataToSend.append("foodOptions", JSON.stringify(formData.foodOptions));
    
    // Send existing image URL if no new file is selected
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    } else if (typeof formData.image === 'string' && formData.image) {
      // Keep existing image - backend will handle it
      // We don't need to send it, backend will keep the old one if no new file is sent
    }
    
    try {
      const result = await updateFoodOptionMutation.mutateAsync({
        id: singleFoodData._id,
        formData: formDataToSend,
      });
      
      if (result) {
        setIsEditing(false);
        // Clean up object URL if a new file was uploaded
        if (formData.image instanceof File && formData.imagePreview) {
          URL.revokeObjectURL(formData.imagePreview);
        }
        console.log("Food option updated successfully");
      }
    } catch (error) {
      console.error("Failed to update food option:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMealOptionChange = (index: number, field: 'name' | 'surcharge', value: string | number) => {
    setFormData(prev => {
      const newFoodOptions = [...prev.foodOptions];
      newFoodOptions[index] = {
        ...newFoodOptions[index],
        [field]: value
      };
      return {
        ...prev,
        foodOptions: newFoodOptions
      };
    });
  };

  const handleAddMealOption = () => {
    setFormData(prev => ({
      ...prev,
      foodOptions: [...prev.foodOptions, { name: 'Breakfast', surcharge: 0 }]
    }));
  };

  const handleRemoveMealOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foodOptions: prev.foodOptions.filter((_, i) => i !== index)
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
        image: file,
        imagePreview: preview
      }));
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (formData.imagePreview && formData.image instanceof File) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(prev => ({
      ...prev,
      image: '',
      imagePreview: ''
    }));
  };

  if (!singleFoodData) {
    return null;
  }

  const getMealIcon = (mealName: string) => {
    switch (mealName.toLowerCase()) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "🍽️";
      case "dinner":
        return "🌙";
      default:
        return "🍴";
    }
  };

  const displayData = isEditing ? formData : singleFoodData;

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
              <span className="text-sm font-medium">Back to Food Options</span>
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
                  disabled={updateFoodOptionMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateFoodOptionMutation.isPending ? (
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
            {/* Food Option Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <UtensilsCrossed className="w-4 h-4 text-rose-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Food Option Information</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Name</p>
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
                                  alt="Food Option Preview" 
                                  className="w-20 h-20 rounded-lg object-cover border border-slate-200" 
                                />
                                <div className="flex-1">
                                  <p className="text-xs text-slate-600">
                                    {formData.image instanceof File ? formData.image.name : 'Existing Image'}
                                  </p>
                                  {formData.image instanceof File && (
                                    <p className="text-xs text-slate-400">
                                      {formData.image.size > 1024 * 1024
                                        ? `${(formData.image.size / (1024 * 1024)).toFixed(2)} MB`
                                        : `${(formData.image.size / 1024).toFixed(2)} KB`}
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
                          displayData.image && (
                            <div className="flex-shrink-0 mt-2">
                              <img 
                                src={displayData.image} 
                                alt="Food Option" 
                                className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditing && displayData.image && (
                    <div className="flex-shrink-0">
                      <img 
                        src={displayData.image} 
                        alt="Food Option" 
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
                      rows={3}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter food option description"
                    />
                  ) : (
                    displayData.description && (
                      <p className="text-xs text-slate-700 leading-relaxed">{displayData.description}</p>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Surcharge Card */}
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
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Surcharge Per Day</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.surchargePerDay}
                        onChange={(e) => handleInputChange('surchargePerDay', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-base font-bold text-indigo-600">{formatCurrency(displayData.surchargePerDay)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Options Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Coffee className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Meal Options</h2>
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleAddMealOption}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Meal
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {formData.foodOptions.map((meal, index) => (
                      <div key={index} className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <select
                            value={meal.name}
                            onChange={(e) => handleMealOptionChange(index, 'name', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                          </select>
                          <input
                            type="number"
                            value={meal.surcharge}
                            onChange={(e) => handleMealOptionChange(index, 'surcharge', Number(e.target.value))}
                            placeholder="Surcharge"
                            className="w-24 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleRemoveMealOption(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600">Surcharge: {formatCurrency(meal.surcharge)}</p>
                      </div>
                    ))}
                    {formData.foodOptions.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No meal options. Click "Add Meal" to add one.</p>
                    )}
                  </div>
                ) : (
                  displayData.foodOptions && displayData.foodOptions.length > 0 ? (
                    <div className="space-y-2">
                      {displayData.foodOptions.map((meal, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded border border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getMealIcon(meal.name)}</span>
                              <p className="text-xs font-semibold text-slate-900">{meal.name}</p>
                            </div>
                            <p className="text-xs font-medium text-indigo-600">+{formatCurrency(meal.surcharge)}</p>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 ml-6">Additional surcharge</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No meal options</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Food Option Summary */}
          <div>
            {/* Food Option Summary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Food Option Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Surcharge Per Day</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.surchargePerDay}
                        onChange={(e) => handleInputChange('surchargePerDay', Number(e.target.value))}
                        className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-xl font-bold text-indigo-600">{formatCurrency(displayData.surchargePerDay)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    {displayData.foodOptions && displayData.foodOptions.length > 0 ? (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Meals Included</p>
                        <div className="space-y-1.5">
                          {displayData.foodOptions.map((meal, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{getMealIcon(meal.name)}</span>
                                <p className="text-xs font-medium text-slate-700">{meal.name}</p>
                              </div>
                              <p className="text-xs font-semibold text-indigo-600">+{formatCurrency(meal.surcharge)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No meals included</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Meals</p>
                    <p className="text-xs text-slate-700 font-semibold">{displayData.foodOptions?.length || 0} meal{displayData.foodOptions?.length !== 1 ? 's' : ''}</p>
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

export default SingleFoodOption;
