import { useState, useRef } from "react";
import {
  UtensilsCrossed,
  ArrowLeft,
  DollarSign,
  FileText,
  Coffee,
  Save,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { createFoodOptionAPI } from "../../api/FoodOptions";

interface CreateFoodOptionsProps {
  onClose: () => void;
}

interface MealOption {
  name: string;
  surcharge: number;
}

export default function CreateFoodOptions({ onClose }: CreateFoodOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    surchargePerDay: 0,
    description: '',
    image: null as File | null,
    imagePreview: '' as string,
    foodOptions: [] as MealOption[],
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

  const handleImageUpload = () => {
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
      const data = new FormData();
      // 🔹 Basic fields
      data.append("name", formData.name);
      data.append("surchargePerDay", String(formData.surchargePerDay));
      data.append("description", formData.description);
  
      // 🔹 Meal options (array → JSON string)
      data.append("foodOptions", JSON.stringify(formData.foodOptions));
  
      // 🔹 Image (single file)
      if (formData.image) {
        data.append("image", formData.image);
      }
  
      console.log("Sending Food Option FormData:");
      console.log("name:", formData.name);
      console.log("surchargePerDay:", formData.surchargePerDay);
      console.log("foodOptions:", formData.foodOptions);
      console.log("image:", formData.image);
  
      const res = await createFoodOptionAPI(data);
  
      if (res) {
        console.log("Food option created successfully:", res);
        onClose();
      } else {
        console.error("Failed to create food option");
      }
    } catch (error) {
      console.error("Create food option error:", error);
    }
  };
  

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
              <span className="text-sm font-medium">Back to Food Options</span>
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
                Save Food Option
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
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter food option name"
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Image</p>
                        {!formData.imagePreview ? (
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            className="w-full px-3 py-2 text-sm border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-slate-600"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </button>
                        ) : (
                          <div className="relative">
                            <img 
                              src={formData.imagePreview} 
                              alt="Food Option Preview" 
                              className="w-full h-32 rounded-lg object-cover border border-slate-200" 
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter food option description"
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
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
                    <input
                      type="number"
                      value={formData.surchargePerDay}
                      onChange={(e) => handleInputChange('surchargePerDay', Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
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
                  <button
                    onClick={handleAddMealOption}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Meal
                  </button>
                </div>
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
                    <input
                      type="number"
                      value={formData.surchargePerDay}
                      onChange={(e) => handleInputChange('surchargePerDay', Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-lg font-bold text-indigo-600 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    {formData.foodOptions.length > 0 ? (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Meals Included</p>
                        <div className="space-y-1.5">
                          {formData.foodOptions.map((meal, index) => (
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
                    <p className="text-xs text-slate-700 font-semibold">{formData.foodOptions.length} meal{formData.foodOptions.length !== 1 ? 's' : ''}</p>
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

