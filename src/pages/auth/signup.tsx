import { signUpWithGoogle } from "@/features/auth";
import React from "react";

const Auth = () => {
  const onClickHandler = async () => {
    const user = await signUpWithGoogle();
    console.log(user); //ここまでok
    // ここで返却した値をreduxに投げるよ
  };
  return (
    <div>
      auth
      <button onClick={onClickHandler}>googleでとーろく</button>
    </div>
  );
};

export default Auth;
