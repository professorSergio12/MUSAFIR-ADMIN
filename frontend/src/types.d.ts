import type { stat } from "fs";

export interface DashboardType {
  totalBookings: number;
  activePackages: number;
  totalHotels: number;
  totalRevenue: number;
}

export interface RecentBookingType {
  _id: string;
  packageId: {
    name: string;
  };
  amount: number;
  createdAt: Date;
  user: {
    username: string;
  };
}

export interface PopularPackageType {
  totalBookings: number;
  name: string;
}

export interface LatestReviewType {
  _id: string;
  user: {
    username: string;
  };
  package: {
    name: string;
  };
  rating: number;
  title: string;
}

export interface AllPackagesType {
  _id: string;
  name: string;
  basePrice: number;
  images: string[];
  bestSeason?: string;
  durationDays: number;
}
export interface SinglePackagesType {
  _id: string;
  name: string;
  basePrice: number;
  images: string;
  bestSeason?: string;
  durdurationDays?: number;
  isRecommended?: boolean;
  description?: string;
  itinerary: ItneraryByIdTypes[];
  availableHotels: SingleHotelType[];
  availableFoodOptions: FoodOptionsByIdTypes[];
}

export interface BookingsType {
  _id: string;
  status: string;
  packageId: {
    name: string;
  };
  user: {
    username: string;
  };
  amount: number;
  orderId: string;
  paymentId: string;
}

export interface SingleBooking {
  _id: string;
  status: string;
  package: SinglePackagesType;
  itinerary: ItneraryByIdTypes[];
  hotels: SingleHotelType[];
  foodOptions: FoodOptionsByIdTypes[];
  user: UserType
  amount: number;
  orderId: string;
  paymentId: string;
}

export interface AllHotelsType {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  tier: 1;
}

type tier = "Budget" | "Standard" | "Luxury";
type RoomTypes = {
  name: string;
  surcharge: number;
};

export interface SingleHotelType {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  images?: string[];
  tier: tier;
  roomTypes: RoomTypes[];
  pricePerNight: number;
  description?: string;
}

export interface AllItneraryTypes {
  _id: string;
  name: string;
  city: string;
  country: string;
  day: number;
}

export interface ItneraryByIdTypes {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  locationImage?: string;
  details?: string;
  day: number;
}

export interface AllFoodOptionsTypes {
  _id: string;
  name: string;
  surchargePerDay: number;
  description: string;
}

type foodType = "Lunch" | "Dinner" | "Breakfast";
type FoodOption = {
  name: foodType;
  surcharge: number;
};
export interface FoodOptionsByIdTypes {
  _id: string;
  name: string;
  surchargePerDay: number;
  description?: string;
  image?: string;
  foodOptions: FoodOption[];
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isAdmin?: boolean;
}
export interface AllReviewsType {
  _id: string;
  user: {
    _id: string;
    username: string;
  }
  package: {
    _id: string;
    name: string;
  }
  rating: number;
  title: string;
  review: string;
  comment?: string;
  images?: string[];
  createdAt: string | Date;
  helpfulVotes?: number;
}

export interface SingleReviewType {
  _id: string;
  rating: number;
  title: string;
  review: string;
  comment?: string;
  images?: string[];
  helpfulVotes?: number;
  createdAt: string | Date;
  user: {
    _id: string;
    username: string;
    email?: string;
    profilePicture?: string;
  };
  package: {
    _id: string;
    name: string;
    basePrice?: number;
    images?: string[];
    country?: string;
  };
}