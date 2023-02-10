import { signInWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { RootState } from "@/redux/store";
import { User } from "@/utils/types";
import Router from "next/router";
import { timelinePath } from "@/utils/urls/client";

const Login = () => {
  const state = useSelector((state: RootState) => state);
  const { isLoggedIn, currentUser } = state.authReducer;
  const dispatch = useDispatch();
  const clickLoginWithGoogleHandler = async () => {
    const { user } = (await signInWithGoogle()) as { user: User };
    dispatch(loginSuccess(user));
    Router.push(timelinePath);
  };

  return (
    <div>
      signIn
      <button onClick={clickLoginWithGoogleHandler}>
        Googleでログインする
      </button>
    </div>
  );
};

export default Login;
