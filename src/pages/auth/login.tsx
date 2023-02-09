import { fetchLogout, signInWithGoogle } from "@/features/auth";
import { loginSuccess, logoutSuccess } from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store";
import { User } from "@/utils/types";

const Login = () => {
  const state = useSelector((state: RootState) => state);
  const { isLoggedIn, currentUser } = state.authReducer;
  const dispatch = useDispatch();
  const clickLoginWithGoogleHandler = async () => {
    const { user } = (await signInWithGoogle()) as { user: User };
    dispatch(loginSuccess(user));
  };
  const clickLogOutHandler = async () => {
    await fetchLogout();
    dispatch(logoutSuccess());
  };
  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);
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
