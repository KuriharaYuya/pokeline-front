import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";

const Comments = () => {
  const { selectedPost, posts } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadComments = async () => {
    const { comments }: { comments: Comment[] } = await apiLocalhost
      .get(`/comments?page=${page}`, {
        params: { post_id: selectedPost.post?.id },
      })
      .then((res) => res.data);
    if (comments.length < 11) {
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
    dispatch(updatePosts(updatedPosts));
  };
  return (
    <>
      <InfiniteScroll
        dataLength={selectedPost.post?.comments?.length!}
        next={loadComments}
        hasMore={hasMore}
        loader={<h4 style={{ textAlign: "center" }}>読み込み中</h4>}
      >
        {selectedPost.post?.comments?.map((comment, index) => {
          return (
            <Card className={styles.commentCard} key={index}>
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
      </InfiniteScroll>
      <form
        onSubmit={handleSubmit(onSubmitComment)}
        className={styles.commentFormContainer}
      >
        <TextareaAutosize
          id="filled-basic"
          placeholder="コメント"
          minRows={3}
          {...register("comment", { required: true })}
        />
        <button>
          <SendIcon />
        </button>
      </form>
    </>
  );
};

export default Comments;
