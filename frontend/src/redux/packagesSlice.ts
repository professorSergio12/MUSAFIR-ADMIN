import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AllPackagesType, SinglePackagesType } from "../types";
import type store from "./store";

type stateType = {
  AllPackage: AllPackagesType[];
  SinglePackage: SinglePackagesType | null;
};

const intialState: stateType = {
  AllPackage: [],
  SinglePackage: null,
};

const packageSlice = createSlice({
  name: "Packages",
  initialState: intialState,
  reducers: {
    setAllPackage: (state, action: PayloadAction<AllPackagesType[]>) => {
      state.AllPackage = action.payload;
    },

    setSinglePackage: (state, action: PayloadAction<SinglePackagesType | null>) => {
      state.SinglePackage = action.payload;
    },
  },
});
export default packageSlice.reducer;
export const { setAllPackage, setSinglePackage } = packageSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
