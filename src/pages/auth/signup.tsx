import { signUpWithGoogle } from "@/features/auth";
import { loginSuccess } from "@/redux/reducers/auth";
import { timelinePath } from "@/utils/urls/client";
import { Alert, Button, Snackbar } from "@mui/material";
import Router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "../../components/common/global.module.scss";

const Auth = () => {
  const dispatch = useDispatch();
  const onClickHandler = async () => {
    const res = await signUpWithGoogle();

    if (res === 400) {
      setOpen(true);
    } else {
      const user = res.user;
      dispatch(loginSuccess(user));
      Router.push(timelinePath);
    }
  };
  // snackbar関連の関数
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      {open && (
        <Alert
          onClose={handleClose}
          severity="error"
          style={{ marginBottom: "1rem" }}
        >
          既に登録されているユーザーです
        </Alert>
      )}
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
