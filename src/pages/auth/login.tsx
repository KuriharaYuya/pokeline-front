import { signInWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { RootState } from "@/redux/store";
import { User } from "@/utils/types";
import Router from "next/router";
import { timelinePath } from "@/utils/urls/client";
import { Alert, Button } from "@mui/material";
import styles from "../../components/common/global.module.scss";

const Login = () => {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const clickLoginWithGoogleHandler = async () => {
    const { user } = (await signInWithGoogle()) as { user: User };
    if (user) {
      dispatch(loginSuccess(user));
      Router.push(timelinePath);
    } else {
      setOpen(true);
    }
  };

  return (
    <div>
      {open && (
        <Alert severity="error">
          <div>ユーザーが見つかりません</div>
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={clickLoginWithGoogleHandler}
        className={styles.authButton}
      >
        Googleでログインする
      </Button>
    </div>
  );
};

export default Login;
