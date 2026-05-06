import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Booking from "./pages/BookingPage/Booking";
import FoodOptions from "./pages/FoodOptionsPage/FoodOptions";
import Itinerary from "./pages/ItineraryPage/Itinerary";
import UserInfo from "./pages/UserInfoPage/UserInfo";
import Gallery from "./pages/GalleryPage/Gallery";
import Review from "./pages/Reviewspage/Review";
import Package from "./pages/Packages/Package";
import HotelDashboard from "./pages/HotelsPage/Hotels";
import HotelDetailPage from "./pages/HotelsPage/HotelDetailPage";
import FoodOptionDetailPage from "./pages/FoodOptionsPage/FoodOptionDetailPage";
import ItineraryDetailPage from "./pages/ItineraryPage/ItineraryDetailPage";
import PackageDetailPage from "./pages/Packages/PackageDetailPage";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/packages" element={<Package />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/hotels" element={<HotelDashboard />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/food-options" element={<FoodOptions />} />
          <Route path="/food-options/:id" element={<FoodOptionDetailPage />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Review />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
