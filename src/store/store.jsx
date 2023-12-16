import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  persist: {
    storage,
    whitelist: ["user"],
  },
});

export default store;
