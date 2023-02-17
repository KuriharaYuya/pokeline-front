import React from "react";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import styles from "./timeline.module.scss";

type Props = {
  handleClickMessageIcon: () => void;
  handleClickEditIcon: () => void;
  handleClickDeleteIcon: () => void;
  createdByCurrentUser: boolean;
};

const ActionIcons = ({
  handleClickMessageIcon,
  handleClickEditIcon,
  handleClickDeleteIcon,
  createdByCurrentUser,
}: Props) => {
  return (
    <div className={styles.IconWrapper}>
      <IconButton
        onClick={handleClickMessageIcon}
        sx={{ ":hover": { color: blue[500] } }}
      >
        <MessageIcon />
      </IconButton>
      {createdByCurrentUser && (
        <>
          <IconButton
            onClick={handleClickEditIcon}
            sx={{ ":hover": { color: blue[500] } }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleClickDeleteIcon}
            sx={{ ":hover": { color: red[500] } }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default ActionIcons;
