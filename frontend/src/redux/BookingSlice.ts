import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingsType, SingleBooking } from "../types";
import type store from "./store";

type stateType = {
  AllBookings: BookingsType[];
  SingleBooking: SingleBooking | null;
};

const intialState: stateType = {
  AllBookings: [],
  SingleBooking: null,
};

const BookingSlice = createSlice({
  name: "Bookings",
  initialState: intialState,
  reducers: {
    setAllBoking: (state, action: PayloadAction<BookingsType[]>) => {
      state.AllBookings = action.payload;
    },

    setSingleBooking: (state, action: PayloadAction<SingleBooking | null>) => {
      state.SingleBooking = action.payload;
    },
  },
});
export default BookingSlice.reducer;
export const { setAllBoking, setSingleBooking } = BookingSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
