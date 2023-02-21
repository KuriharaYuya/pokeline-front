import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import { Badge, Button, Card, Modal } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Image from "next/image";
import { dateTimeFormat } from "@/utils/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NotificationWithComment } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
const Notifications = () => {
  const { isLoggedIn, currentUser } = useSelector(
    (state: RootState) => state.authReducer
  );
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const handleCloseNotificationModal = () => {
    setNotificationModalOpen(false);
  };
  const [uncheckNotificationsLength, setUncheckNotificationsLength] =
    useState(0);
  const [notifications, setNotifications] = useState<NotificationWithComment[]>(
    []
  );
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        type Props = {
          notifications: NotificationWithComment[];
          unchecks: number;
        };
        const { notifications, unchecks }: Props = await apiLocalhost
          .get("/notifications")
          .then((res) => res.data);
        setNotifications(notifications);
        setUncheckNotificationsLength(unchecks);
      })();
    }
  }, []);
  return (
    <>
      {isLoggedIn && currentUser && (
        <>
          <div className={styles.NotificationBadgeWrapper}>
            <Button onClick={() => setNotificationModalOpen(true)}>
              <Badge badgeContent={uncheckNotificationsLength} color="primary">
                <NotificationsIcon />
              </Badge>
            </Button>
          </div>
          <Modal
            open={notificationModalOpen}
            onClose={handleCloseNotificationModal}
            className={styles.notificationModal}
          >
            <>
              {notifications.map((notification, index) => {
                return (
                  <Card key={index} className={styles.notificationWrapper}>
                    <p>{dateTimeFormat(notification.created_at)}</p>
                    <div className={styles.visitorProfile}>
                      <Image
                        width={30}
                        height={30}
                        src={notification.visitor_img}
                        alt={notification.visitor_name}
                      />
                      <span>{notification.visitor_name}</span>
                    </div>
                    あなたの投稿にコメントしました。
                    <p>{notification.comment_content}</p>
                    <div className={styles.postPreView}>
                      <Image
                        width={30}
                        height={30}
                        src={currentUser.picture}
                        alt={currentUser.name}
                      />
                      {notification.post_title}
                    </div>
                  </Card>
                );
              })}
            </>
          </Modal>
        </>
      )}
    </>
  );
};

export default Notifications;
