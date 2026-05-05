import {
  User,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  MapPin,
  Hotel,
  UtensilsCrossed,
  Mail,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/BookingSlice";
import { setSingleBooking } from "../../redux/BookingSlice";

interface SingleBookingProps {
  onClose: () => void;
}

const SingleBooking = ({ onClose }: SingleBookingProps) => {
  const dispatch = useDispatch();
  const { SingleBooking } = useSelector((state: RootState) => state.Bookings);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClose = () => {
    dispatch(setSingleBooking(null));
    onClose();
  };

  if (!SingleBooking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-3">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Bookings</span>
          </button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-3">
            {/* User Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Customer Information</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Username</p>
                        <p className="text-sm font-semibold text-slate-900">{SingleBooking.user?.username || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Email Address</p>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-xs text-slate-700">{SingleBooking.user?.email || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {SingleBooking.user?.profilePicture && (
                    <div className="flex-shrink-0">
                      <img 
                        src={SingleBooking.user.profilePicture} 
                        alt="User" 
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Package Booked Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Package Details</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Package Name</p>
                        <p className="text-sm font-semibold text-slate-900">{SingleBooking.package.name || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Base Price</p>
                          <p className="text-base font-bold text-indigo-600">{formatCurrency(SingleBooking.package?.basePrice || 0)}</p>
                        </div>
                        {SingleBooking.package?.durdurationDays && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Duration</p>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-xs font-medium text-slate-700">{SingleBooking.package.durdurationDays} days</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {SingleBooking.package?.images && (
                    <div className="flex-shrink-0">
                      <img 
                        src={SingleBooking.package.images} 
                        alt="Package" 
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotels Card */}
            {SingleBooking.hotels && SingleBooking.hotels.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Hotel className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Accommodation</h2>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      {SingleBooking.hotels.slice(0, 3).map((hotel) => (
                        <div key={hotel._id} className="p-2 bg-slate-50 rounded border border-slate-100">
                          <p className="text-xs font-semibold text-slate-900 mb-0.5">{hotel.name}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-600">{hotel.tier || 'Standard'}</p>
                            <p className="text-xs font-medium text-indigo-600">{formatCurrency(hotel.pricePerNight)}/night</p>
                          </div>
                        </div>
                      ))}
                      {SingleBooking.hotels.length > 3 && (
                        <p className="text-xs text-slate-500 font-medium">+{SingleBooking.hotels.length - 3} more hotels</p>
                      )}
                    </div>
                    {SingleBooking.hotels[0]?.images && SingleBooking.hotels[0].images.length > 0 && (
                      <div className="flex-shrink-0">
                        <img 
                          src={SingleBooking.hotels[0].images[0]} 
                          alt="Hotel" 
                          className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Card */}
            {SingleBooking.itinerary && SingleBooking.itinerary.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Travel Itinerary</h2>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      {SingleBooking.itinerary.slice(0, 3).map((item) => (
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
                      {SingleBooking.itinerary.length > 3 && (
                        <p className="text-xs text-slate-500 font-medium">+{SingleBooking.itinerary.length - 3} more locations</p>
                      )}
                    </div>
                    {SingleBooking.itinerary[0]?.locationImage && (
                      <div className="flex-shrink-0">
                        <img 
                          src={SingleBooking.itinerary[0].locationImage.toString()} 
                          alt="Location" 
                          className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Food Options Card */}
            {SingleBooking.foodOptions && SingleBooking.foodOptions.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                      <UtensilsCrossed className="w-4 h-4 text-rose-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Meal Plans</h2>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      {SingleBooking.foodOptions.slice(0, 3).map((food) => (
                        <div key={food._id} className="p-2 bg-slate-50 rounded border border-slate-100">
                          <p className="text-xs font-semibold text-slate-900 mb-0.5">{food.name}</p>
                          <p className="text-xs text-slate-600">Surcharge: <span className="font-medium text-indigo-600">{formatCurrency(food.surchargePerDay)}/day</span></p>
                        </div>
                      ))}
                      {SingleBooking.foodOptions.length > 3 && (
                        <p className="text-xs text-slate-500 font-medium">+{SingleBooking.foodOptions.length - 3} more options</p>
                      )}
                    </div>
                    {SingleBooking.foodOptions[0]?.image && (
                      <div className="flex-shrink-0">
                        <img 
                          src={SingleBooking.foodOptions[0].image} 
                          alt="Food" 
                          className="w-24 h-24 rounded-lg object-cover border border-slate-200" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            {/* Booking Summary Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">Booking Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-indigo-600">{formatCurrency(SingleBooking.amount)}</p>
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Order ID</p>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-xs font-mono text-slate-700 break-all">{SingleBooking.orderId || '-'}</p>
                      </div>
                    </div>
                    
                    {SingleBooking.paymentId && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Payment ID</p>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-xs font-mono text-slate-700 break-all">{SingleBooking.paymentId}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Booking Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs w-full justify-center ${
                      SingleBooking.status === "Confirmed" ? "bg-green-50 text-green-700 border border-green-200" :
                      SingleBooking.status === "Pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                      "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {SingleBooking.status === "Confirmed" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       SingleBooking.status === "Pending" ? <Clock className="w-3.5 h-3.5" /> :
                       <XCircle className="w-3.5 h-3.5" />}
                      {SingleBooking.status}
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
};

export default SingleBooking;
