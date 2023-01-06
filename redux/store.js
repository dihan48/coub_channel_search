import { configureStore } from "@reduxjs/toolkit";
import feed from "./feedSlice";

export const store = configureStore({
  reducer: {
    feed,
  },
});
