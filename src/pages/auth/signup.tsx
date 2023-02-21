import { signUpWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { timelinePath } from "@/utils/urls/client";
import { Button } from "@mui/material";
import Router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "../../components/common/global.module.scss";

const Auth = () => {
  const dispatch = useDispatch();
  const onClickHandler = async () => {
    const user = await signUpWithGoogle();
    dispatch(loginSuccess(user));
    Router.push(timelinePath);
  };
  return (
    <div>
      <Button
        variant="contained"
        onClick={onClickHandler}
        className={styles.authButton}
      >
        googleで登録
      </Button>
    </div>
  );
};

export default Auth;
