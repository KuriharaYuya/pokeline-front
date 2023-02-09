import { signUpWithGoogle } from "@/features/auth";
import React from "react";

const Auth = () => {
  const onClickHandler = async () => {
    const user = await signUpWithGoogle();
    // ここで返却した値をログインさせる。サーバーでログインまでやるよ。
  };
  return (
    <div>
      auth
      <button onClick={onClickHandler}>googleでとーろく</button>
    </div>
  );
};

export default Auth;
