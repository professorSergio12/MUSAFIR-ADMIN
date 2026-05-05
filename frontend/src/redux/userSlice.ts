import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  role?: string; // Musafir backend uses "role" field with value "admin"
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setCurrentUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
