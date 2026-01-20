import { configureStore } from "@reduxjs/toolkit";
import dashBoadReducer from "./dashboardSlice";
import hotelReducer from "./HotelSlice";
import foodOptionReducer from "./FoodOption";
import locationReducer from "./Locations";
import BookingReducer from "./BookingSlice";
import packageReducer from "./packagesSlice";
import reviewsReducer from "./reviewsSlice";

const store = configureStore({
  reducer: {
    Dashboard: dashBoadReducer,
    Hotels: hotelReducer,
    FoodOptions: foodOptionReducer,
    Locations: locationReducer,
    Bookings: BookingReducer,
    Packages: packageReducer,
    Reviews: reviewsReducer,
  },
});
export default store;
