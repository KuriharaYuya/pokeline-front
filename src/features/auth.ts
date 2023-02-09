import { logoutSuccess } from "@/redux/reducers/auth";
import store from "@/redux/store";
import { apiLocalhost } from "@/utils/urls";
import { getAuth, signInWithPopup } from "firebase/auth";
import { provider } from "../libs/firebase/init";
const auth = getAuth();

const getAccessToken = async () => {
  const idToken = await auth.currentUser!.getIdToken();
  return idToken;
};

export const signUpWithGoogle = async () => {
  // サインアップ
  await signInWithPopup(auth, provider);
  // googleでsignupするとfirebaseとしてはログイン扱いになってるので、tokenを取得してserverに投げる
  return getAccessToken().then(async (token) => {
    const accessToken: string = token;
    try {
      const { user } = await apiLocalhost
        .post("/users", {
          user: {
            access_token: accessToken,
          },
        })
        .then((res) => res.data);
      return user;
    } catch (error) {
      console.log(error);
    }
  });
};

export const signInWithGoogle = async () => {
  await signInWithPopup(auth, provider);
  const token = await getAccessToken();
  return await fetchLogin(token).then((res) => res.data);
};

const fetchLogin = async (accessToken: string) => {
  return await apiLocalhost.post("/sessions", {
    session: { access_token: accessToken },
  });
};

export const fetchLogout = async () => {
  return await apiLocalhost.delete("/sessions").then((res) => res.data);
};

export const requestLogout = () => {
  store.dispatch(logoutSuccess());
};
