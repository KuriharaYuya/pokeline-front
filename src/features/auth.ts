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
