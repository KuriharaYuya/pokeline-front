import React from "react";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Badge, IconButton } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import styles from "./timeline.module.scss";

type Props = {
  handleClickMessageIcon: () => void;
  handleClickEditIcon: () => void;
  handleClickDeleteIcon: () => void;
  createdByCurrentUser: boolean;
  commentsLength: number;
};

const ActionIcons = ({
  handleClickMessageIcon,
  handleClickEditIcon,
  handleClickDeleteIcon,
  createdByCurrentUser,
  commentsLength,
}: Props) => {
  return (
    <div className={styles.IconWrapper}>
      <IconButton
        onClick={handleClickMessageIcon}
        sx={{
          color: "#fff",
          ":hover": { color: blue[500], important: "true" },
        }}
      >
        <Badge badgeContent={commentsLength} color="primary">
          <MessageIcon />
        </Badge>
      </IconButton>
      {createdByCurrentUser && (
        <>
          <IconButton
            onClick={handleClickEditIcon}
            sx={{
              color: "#fff",
              ":hover": { color: blue[500], important: "true" },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleClickDeleteIcon}
            sx={{
              color: "#fff",
              ":hover": { color: red[500], important: "true" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default ActionIcons;
