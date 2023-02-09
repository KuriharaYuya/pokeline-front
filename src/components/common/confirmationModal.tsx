import React from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type ExecFunction = (...args: any[]) => any;
type Props = {
  handleClose: (...args: any[]) => void;
  confirmationTxt: string;
  execFunc: ExecFunction;
  open: boolean;
};
const ConfirmationModal: React.FC<Props> = ({
  handleClose,
  confirmationTxt,
  execFunc,
  open,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{confirmationTxt}</DialogTitle>
      <DialogActions>
        <Button onClick={execFunc} autoFocus>
          はい
        </Button>
        <Button onClick={handleClose}>いいえ</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
