import { signInWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { User } from "@/utils/types";
import Router from "next/router";
import { timelinePath } from "@/utils/urls/client";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";

const Login = () => {
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://pokeline-yuya-back.herokuapp.com/api/v1/posts"
      );
      console.log(res);
    })();
  }, []);
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

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      {open && (
        <Alert severity="error">
          <div>ユーザーが見つかりません</div>
        </Alert>
      )}
      <button onClick={clickLoginWithGoogleHandler}>
        Googleでログインする
      </button>
    </div>
  );
};

export default Login;
