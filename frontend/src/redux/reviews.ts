import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingsType, SingleBooking, SingleReviewType } from "../types";
import type store from "./store";

type stateType = {
  AllReviews: AllRevi[];
  SingleReviews: SingleReviewType | null;
};

const intialState: stateType = {
    AllReviews: [],
    SingleReviews: null,
};

const BookingSlice = createSlice({
  name: "Reviews",
  initialState: intialState,
  reducers: {
    setAllBoking: (state, action: PayloadAction<ReviewType[]>) => {
      state.AllReviews = action.payload;
    },

    setSingleBooking: (state, action: PayloadAction<SingleBooking | null>) => {
      state.SingleReviews = action.payload;
    },
  },
});
export default BookingSlice.reducer;
export const { setAllBoking, setSingleBooking } = BookingSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
