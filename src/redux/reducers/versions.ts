import { Versions } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

const versionsSlice = createSlice({
  name: "versions",
  initialState: { versions: undefined } as { versions: Versions },
  reducers: {
    updateVersions: (state, action) => {
      state.versions = action.payload;
      return state;
    },
  },
});

export const { updateVersions } = versionsSlice.actions;

export default versionsSlice.reducer;
