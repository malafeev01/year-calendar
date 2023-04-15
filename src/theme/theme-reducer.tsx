import { createSlice } from "@reduxjs/toolkit";
import { getCurrentTheme } from "./theme-utils";

export const themeSlice = createSlice({
  name: "theme",
  initialState: getCurrentTheme(),
  reducers: {
    setDark: () => {
      return "dark";
    },
    setLight: () => {
      return "light";
    },
  },
});

export const { setDark, setLight } = themeSlice.actions;
export default themeSlice.reducer;
