import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AllItneraryTypes, ItneraryByIdTypes } from "../types";
import type store from "./store";

type stateType = {
  AllLocation: AllItneraryTypes[];
  SingleLocation: ItneraryByIdTypes | null;
  totalItinerary: number;
};

const intialState: stateType = {
  AllLocation: [],
  SingleLocation: null,
  totalItinerary: 0,
};

const LocationSlice = createSlice({
  name: "Locations",
  initialState: intialState,
  reducers: {
    setAllLocation: (state, action: PayloadAction<AllItneraryTypes[]>) => {
      state.AllLocation = action.payload;
    },

    setSingleLocation: (state, action: PayloadAction<ItneraryByIdTypes | null>) => {
      state.SingleLocation = action.payload;
    },

    setTotalItinerary: (state, action: PayloadAction<number>) => {
      state.totalItinerary = action.payload;
    },
  },
});
export default LocationSlice.reducer;
export const { setAllLocation, setSingleLocation, setTotalItinerary } = LocationSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
