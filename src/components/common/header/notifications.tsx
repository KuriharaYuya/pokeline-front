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
  const perPageItems = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      type Props = {
        notifications: NotificationWithComment[];
        unchecks: number;
      };
      const { notifications, unchecks }: Props = await apiLocalhost
        .get("/notifications", {
          params: {
            page: currentPage,
          },
        })
        .then((res) => res.data);
      setNotifications(notifications);
      setUncheckNotificationsLength(unchecks);
      if (notifications.length < perPageItems) setHasMore(false);
    })();
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore) return;
    console.log("load more");
    const { notifications } = await apiLocalhost
      .get("/notifications", {
        params: {
          page: currentPage,
        },
      })
      .then((res) => res.data);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      ...notifications,
    ]);
    setCurrentPage(currentPage + 1);
    setHasMore(notifications.length > 0);
  };

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
                    <p className={styles.msg}>
                      あなたの投稿にコメントがありました
                    </p>
                    <div className={styles.visitorProfile}>
                      <Image
                        width={30}
                        height={30}
                        src={notification.visitor_img}
                        alt={notification.visitor_name}
                      />
                      <span>{notification.visitor_name}</span>
                    </div>
                    <p className={styles.comment_content}>
                      {notification.comment_content}
                    </p>
                    <br />
                    <div className={styles.postPreView}>
                      {notification.post_title}
                    </div>
                  </Card>
                );
              })}
              {hasMore ? (
                <Button onClick={handleLoadMore}>load more</Button>
              ) : (
                <h3 style={{ textAlign: "center" }}>
                  これ以上通知はありません
                </h3>
              )}
            </>
          </Modal>
        </>
      )}
    </>
  );
};

export default Notifications;
