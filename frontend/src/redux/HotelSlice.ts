import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AllHotelsType, SingleHotelType } from "../types";
import type store from "./store";

type stateType = {
  AllHotels: AllHotelsType[];
  SingleHotel: SingleHotelType | null;
  totalHotels: number;
};

const intialState: stateType = {
  AllHotels: [],
  SingleHotel: null,
  totalHotels: 0,
};

const HotelSlice = createSlice({
  name: "Hotels",
  initialState: intialState,
  reducers: {
    setAllHotels: (state, action: PayloadAction<AllHotelsType[]>) => {
      state.AllHotels = action.payload;
    },

    setSingleHotel: (state, action: PayloadAction<SingleHotelType | null>) => {
      state.SingleHotel = action.payload;
    },

    setTotalHotels: (state, action: PayloadAction<number>) => {
      state.totalHotels = action.payload;
    },
  },
});
export default HotelSlice.reducer;
export const { setAllHotels, setSingleHotel, setTotalHotels } = HotelSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
