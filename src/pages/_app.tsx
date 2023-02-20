import Header from "@/components/common/header/header";
import { requestLogout } from "@/features/auth";
import "@/styles/globals.css";
import { getCookie } from "@/utils/client";
import { loginPath, singUpPath, timelinePath } from "@/utils/urls/client";
import { apiLocalhost } from "@/utils/urls/server";
import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";
import styles from "../components/common/global.module.scss";

apiLocalhost.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const requireLoginPaths = [timelinePath];
  const blockWhenLoggedInPaths = [singUpPath, loginPath];

  // // apiLocalhost.interceptors.response.use(
  // //   (response) => {
  // //     return response;
  // //   },
  // //   (error) => {
  // //     if (error.response.status === 401) {
  // //       // 401エラーの処理
  // //       requestLogout();
  // //       location.reload();
  // //     }
  // //   }
  // );
  if (typeof window !== "undefined") {
    const isLoggedIn = getCookie("logged_in");
    if (!isLoggedIn) {
      requestLogout();
    }

    if (!isLoggedIn && requireLoginPaths.includes(router.pathname)) {
      Router.push(loginPath);
    } else if (isLoggedIn && blockWhenLoggedInPaths.includes(router.pathname)) {
      // Router.back();
    }
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Header />
        <section className={styles.globalStyles}>
          <Component {...pageProps} />
        </section>
      </PersistGate>
    </Provider>
  );
}
