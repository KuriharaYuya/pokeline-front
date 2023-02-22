import {
  Card,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./timeline.module.scss";
import SendIcon from "@mui/icons-material/Send";
import { apiLocalhost } from "@/utils/urls/server";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updatePosts } from "@/redux/reducers/posts";
import Image from "next/image";
import { dateTimeFormat } from "@/utils/client";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ConfirmationModal from "../common/confirmationModal";
import { loginPath } from "@/utils/urls/client";
import Router from "next/router";

const Comments = () => {
  const { selectedPost, posts } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const { currentUser, isLoggedIn } = useSelector(
    (state: RootState) => state.authReducer
  );
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const onSubmitComment = async (data: any) => {
    const content = data.comment as { comment: string };
    // API叩く
    const { comment } = await apiLocalhost
      .post(`/comments`, {
        comment: { content, post_id: selectedPost.post?.id },
      })
      .then((res) => res.data);
    // コメント一覧を更新する
    const updatedPosts = posts?.map((post) => {
      if (post.id === selectedPost.post?.id) {
        const newComments = [...post.comments!, comment];
        return { ...post, comments: newComments };
      } else {
        return post;
      }
    });
    dispatch(updatePosts(updatedPosts));
    reset();
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteComment = async (commentId: string) => {
    // API叩く
    await apiLocalhost.delete(`/comments/${commentId}`);
    //  コメント一覧を更新する
    const updatedPosts = posts?.map((post) => {
      if (post.id === selectedPost.post?.id) {
        const newComments = post.comments?.filter(
          (comment) => comment.id !== commentId
        );
        return { ...post, comments: newComments };
      } else {
        return post;
      }
    });
    handleClose();
    dispatch(updatePosts(updatedPosts));
  };
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (commentsEndRef.current) {
      const topPosition = commentsEndRef.current.offsetTop;
      const windowHeight = window.innerHeight;
      const thirtyPercentOfWindowHeight = windowHeight * 0.3;
      if (
        topPosition - thirtyPercentOfWindowHeight < scrollPosition &&
        hasMore
      ) {
        setIsLoading(true);
        (async () => await loadComments())();
      } else if (topPosition - windowHeight * 0.1 < scrollPosition) {
        // 画面上部10%までrefがスクロールされたなら、refをnullにする
        commentsEndRef.current = null;
      }
    }
  }, [scrollPosition]);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadComments = async () => {
    const { comments }: { comments: Comment[] } = await apiLocalhost
      .get(`/comments?page=${page}`, {
        params: { post_id: selectedPost.post?.id },
      })
      .then((res) => res.data);
    if (comments.length === 0 || comments.length < 10) {
      setHasMore(false);
    }
    setPage(page + 1);
    const updatedPosts = posts?.map((post) => {
      if (post.id === selectedPost.post?.id) {
        const newComments = [...post.comments!, ...comments];
        return { ...post, comments: newComments };
      } else {
        return post;
      }
    });
    setIsLoading(false);
    dispatch(updatePosts(updatedPosts));
  };
  // ログインを促すモーダルの開閉を定義

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };
  const handleJumpLoginPage = () => {
    Router.push(loginPath);
  };
  const checkLogin = () => {
    if (!currentUser) {
      setOpenLoginModal(true);
    }
  };

  return (
    <>
      {selectedPost.post?.comments && (
        <>
          <ConfirmationModal
            handleClose={handleCloseLoginModal}
            confirmationTxt={
              "コメントにはログインが必要です。ログインしますか？"
            }
            execFunc={handleJumpLoginPage}
            open={openLoginModal}
          />
          {selectedPost.post?.comments?.map((comment, index) => {
            return (
              <Card
                ref={commentsEndRef}
                className={styles.commentCard}
                key={index}
              >
                <div className={styles.commentUserWrapper}>
                  <Image
                    src={comment.user_img}
                    alt={comment.user_name}
                    width={100}
                    height={100}
                  />
                  <span>{comment.user_name}</span>
                  <span>{dateTimeFormat(comment.created_at)}</span>
                </div>
                {currentUser?.id === comment.user_id && (
                  <div className={styles.menuIcon}>
                    <Tooltip title="Open menu">
                      <IconButton sx={{ p: 0 }} onClick={handleClick}>
                        <MoreHorizIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className={styles.confirmation}
                      >
                        削除する
                      </MenuItem>
                    </Menu>
                  </div>
                )}
                <p>{comment.content}</p>
              </Card>
            );
          })}
          <div className={styles.commentsLoader}>
            {isLoading && hasMore && <CircularProgress />}
          </div>
        </>
      )}

      <form
        onSubmit={handleSubmit(onSubmitComment)}
        className={styles.commentFormContainer}
      >
        <TextareaAutosize
          onClick={checkLogin}
          id="filled-basic"
          placeholder="コメント"
          minRows={3}
          {...register("comment", { required: true })}
        />
        {isLoggedIn && currentUser && (
          <button>
            <SendIcon />
          </button>
        )}
      </form>
    </>
  );
};

export default Comments;
