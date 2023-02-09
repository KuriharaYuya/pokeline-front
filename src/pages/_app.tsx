import Header from "@/components/common/header";
import { requestLogout } from "@/features/auth";
import "@/styles/globals.css";
import { getCookie } from "@/utils/client";
import axios from "axios";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";

axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const isLoggedIn = getCookie("logged_in");
    if (!isLoggedIn) requestLogout();
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Header />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}
