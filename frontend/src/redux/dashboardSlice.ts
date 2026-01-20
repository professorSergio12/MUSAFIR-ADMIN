import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DashboardType,
  LatestReviewType,
  PopularPackageType,
  RecentBookingType,
} from "../types";
import type store from "./store";

type stateType = {
  dashboard: DashboardType | null;
  recentBookings: RecentBookingType[];
  latestReviews: LatestReviewType[];
  popularPackges: PopularPackageType[];
};

const intialState: stateType = {
  dashboard: null,
  recentBookings: [],
  latestReviews: [],
  popularPackges: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: intialState,
  reducers: {
    setDashboard: (state, action: PayloadAction<DashboardType>) => {
      state.dashboard = action.payload;
    },

    setRecentBooking: (state, action: PayloadAction<RecentBookingType[]>) => {
      state.recentBookings = action.payload;
    },
    setLatestReviews: (state, action: PayloadAction<LatestReviewType[]>) => {
      state.latestReviews = action.payload;
    },
    setPopularPackages: (
      state,
      action: PayloadAction<PopularPackageType[]>
    ) => {
      state.popularPackges = action.payload;
    },
  },
});
export default dashboardSlice.reducer;
export const {
  setDashboard,
  setLatestReviews,
  setRecentBooking,
  setPopularPackages,
} = dashboardSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
