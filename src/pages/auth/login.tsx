import { fetchLogout, signInWithGoogle } from "@/features/auth";
import React from "react";

const Login = () => {
  const clickLoginWithGoogleHandler = async () => {
    const test = await signInWithGoogle();
    console.log(test);
  };
  const clickLogOutHandler = async () => {
    const test = await fetchLogout();
    console.log(test);
  };
  return (
    <div>
      signIn
      <button onClick={clickLoginWithGoogleHandler}>
        Googleでログインする
      </button>
      <button onClick={clickLogOutHandler}>ログアウトする</button>
    </div>
  );
};

export default Login;
