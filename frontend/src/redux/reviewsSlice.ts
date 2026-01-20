import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AllReviewsType } from "../types.d";
import type store from "./store";

type stateType = {
  AllReviews: AllReviewsType[];
  SingleReview: AllReviewsType | null;
  totalReviews: number;
};

const initialState: stateType = {
  AllReviews: [],
  SingleReview: null,
  totalReviews: 0,
};

const reviewsSlice = createSlice({
  name: "Reviews",
  initialState,
  reducers: {
    setAllReviews: (state, action: PayloadAction<AllReviewsType[]>) => {
      state.AllReviews = action.payload;
    },
    setSingleReview: (state, action: PayloadAction<AllReviewsType | null>) => {
      state.SingleReview = action.payload;
    },
    setTotalReviews: (state, action: PayloadAction<number>) => {
      state.totalReviews = action.payload;
    },
  },
});

export default reviewsSlice.reducer;
export const { setAllReviews, setSingleReview, setTotalReviews } =
  reviewsSlice.actions;

export type RootState = ReturnType<typeof store.getState>;


