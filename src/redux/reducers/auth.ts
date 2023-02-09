import { User } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | undefined;
}

const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
      return state;
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.currentUser = undefined;
      localStorage.removeItem("persist:auth");
      return state;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
