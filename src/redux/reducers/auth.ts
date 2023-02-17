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
      document.cookie =
        "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("persist:auth");
      return state;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
