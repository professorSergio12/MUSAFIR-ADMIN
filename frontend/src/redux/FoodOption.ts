import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingsType,
  FoodOption,
  FoodOptionsByIdTypes,
  SingleBooking,
} from "../types";
import type store from "./store";

type stateType = {
  AllFoods: FoodOptionsByIdTypes[];
  SingleFoods: FoodOptionsByIdTypes | null;
  totalFoods: number;
};

const intialState: stateType = {
  AllFoods: [],
  SingleFoods: null,
  totalFoods: 0,
};

const FoodSlice = createSlice({
  name: "Food Options",
  initialState: intialState,
  reducers: {
    setAllFoods: (state, action: PayloadAction<FoodOptionsByIdTypes[]>) => {
      state.AllFoods = action.payload;
    },

    setSingleFoods: (state, action: PayloadAction<FoodOptionsByIdTypes | null>) => {
      state.SingleFoods = action.payload;
    },

    setTotalFoods: (state, action: PayloadAction<number>) => {
      state.totalFoods = action.payload;
    },
  },
});
export default FoodSlice.reducer;
export const { setAllFoods, setSingleFoods, setTotalFoods } = FoodSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
