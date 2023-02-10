import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import versionsReducer from "./reducers/versions";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  authReducer,
  versionsReducer,
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["authReducer"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  //   persisのnon serializableエラー解消のために、middleware導入
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export default store;
