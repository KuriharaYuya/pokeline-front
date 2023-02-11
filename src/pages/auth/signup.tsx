import { signUpWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { timelinePath } from "@/utils/urls/client";
import Router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";

const Auth = () => {
  const dispatch = useDispatch();
  const onClickHandler = async () => {
    const user = await signUpWithGoogle();
    dispatch(loginSuccess(user));
    Router.push(timelinePath);
  };
  return (
    <div>
      auth
      <button onClick={onClickHandler}>googleでとーろく</button>
    </div>
  );
};

export default Auth;
