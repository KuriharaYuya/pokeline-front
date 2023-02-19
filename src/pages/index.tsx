import ActionIcons from "@/components/timeline/actionIcons";
import { Post } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import {
  Alert,
  Card,
  Divider,
  Fab,
  Snackbar,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../components/timeline/timeline.module.scss";
import { RootState } from "@/redux/store";
import { updatePosts, updateSelectedPost } from "@/redux/reducers/posts";
import ConfirmationModal from "@/components/common/confirmationModal";
import Comments from "@/components/timeline/comments";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollTop from "@/components/timeline/scrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TimeLine = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const { posts, selectedPost } = useSelector(
    (state: RootState) => state.postsReducer
  );

  useEffect(() => {
    (async () => {
      const { posts } = await apiLocalhost
        .get("/posts")
        .then((res) => res.data);
      dispatch(updatePosts(posts));
    })();
  }, []);

  const handlePostSelect = (post: Post) => {
    if (selectedPost.post?.id === post.id) return;
    dispatch(updateSelectedPost({ post, editing: false }));
  };
  const [commentingPost, setCommentingPost] = useState<Post | undefined>(
    undefined
  );
  const handleClickMessageIcon = () => {
    setCommentingPost(selectedPost.post);
  };
  const handleClickEditIcon = () => {
    if (selectedPost.post === undefined) return;
    dispatch(updateSelectedPost({ ...selectedPost, editing: true }));
  };

  const { register, handleSubmit } = useForm();

  type onSubmitProp = {
    title: string;
    content: string;
  };
  const onSubmit = async (data: any) => {
    const { title, content } = data as onSubmitProp;
    // API叩く
    const { post } = await apiLocalhost
      .patch(`/posts/${selectedPost.post?.id}`, {
        posts: { title, content },
      })
      .then((res) => res.data);
    const updatedPosts = posts?.map((tgtPost) => {
      if (tgtPost.id === post.id) {
        return post;
      } else {
        return tgtPost;
      }
    });
    dispatch(updatePosts(updatedPosts));
    dispatch(
      updateSelectedPost({
        ...selectedPost,
        editing: false,
        post: post,
      })
    );
  };
  const [open, setOpen] = useState(false);
  const handleDeleteModalOpen = () => {
    setOpen(true);
  };
  const handleDeleteModalClose = () => {
    setOpen(false);
  };
  const deletePost = async () => {
    const postId = selectedPost.post?.id;
    await apiLocalhost.delete(`/posts/${postId}`);
    const updatedPosts = posts?.filter((post) => post.id !== postId);
    dispatch(updatePosts(updatedPosts));
    dispatch(updateSelectedPost({ post: undefined, editing: false }));
    handleDeleteModalClose();
  };
  const actionIconsFuncs = {
    handleClickMessageIcon,
    handleClickEditIcon,
    handleClickDeleteIcon: handleDeleteModalOpen,
  };
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const loadComments = async () => {
    const morePosts = await apiLocalhost
      .get(`/posts?page=${page}`)
      .then((res) => res.data.posts);
    if (morePosts.length < 10) {
      setHasMore(false);
    }
    setPage(page + 1);
    dispatch(updatePosts([...posts!, ...morePosts]));
  };
  useEffect(() => {
    const updatedSelectedPost = posts?.find((post) => {
      post.id === selectedPost.post?.id;
      return post;
    });
    dispatch(
      updateSelectedPost({
        post: updatedSelectedPost,
        editing: selectedPost.editing,
      })
    );

    if (posts && posts.length < 11) {
      setHasMore(true);
    }
  }, [posts]);

  return (
    <>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <ConfirmationModal
          handleClose={handleDeleteModalClose}
          confirmationTxt="本当にこの投稿を削除しますか？"
          execFunc={deletePost}
          open={open}
        />
        {posts && posts.length > 0 ? (
          <div className={styles.cardsWrapper}>
            <InfiniteScroll
              dataLength={posts.length}
              next={loadComments}
              hasMore={hasMore}
              endMessage={
                <h2 style={{ textAlign: "center" }}>
                  これ以上投稿はありません
                </h2>
              }
              loader={<h4 style={{ textAlign: "center" }}>読み込み中</h4>}
            >
              {posts.map((post, index) => {
                return (
                  <Card
                    id="back-to-top-anchor"
                    key={index}
                    className={
                      post.id === selectedPost.post?.id
                        ? styles.selectedPost
                        : styles.postCard
                    }
                    onClick={() => handlePostSelect(post)}
                  >
                    {post.id === selectedPost.post?.id && (
                      <>
                        <ActionIcons
                          {...actionIconsFuncs}
                          createdByCurrentUser={
                            post.user_id === currentUser?.id
                          }
                        />
                      </>
                    )}
                    <div className={styles.pokemonImageWrapper}>
                      <Image
                        className={styles.pokemonImage}
                        src={post.pokemon_image}
                        alt={post.pokemon_name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.postHeader}>
                      <h1>{post.pokemon_name}</h1>
                      <h2 className={styles.test}>{post.version_name}</h2>
                      <h4>{post.generation_name}</h4>
                    </div>

                    <Alert
                      className={styles.userContainer}
                      icon={false}
                      variant="outlined"
                      severity="info"
                    >
                      <div>
                        <Image
                          src={post.user_img}
                          alt={post.user_name}
                          width={100}
                          height={100}
                        />
                        <span>{post.user_name} </span>
                      </div>
                    </Alert>
                    <div className={styles.postContainer}>
                      {selectedPost.post?.id === post.id &&
                      selectedPost.editing ? (
                        <div className={styles.postFormWrapper}>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <button>編集を完了する</button>
                            <TextField
                              id="filled-basic"
                              label="タイトル"
                              variant="filled"
                              type="text"
                              defaultValue={selectedPost.post?.title}
                              {...register("title", { required: true })}
                            />
                            <TextareaAutosize
                              defaultValue={selectedPost.post?.content}
                              {...register("content", { required: true })}
                            />
                          </form>
                        </div>
                      ) : (
                        <>
                          <h2>{post.title}</h2>
                          <p>{post.content}</p>
                        </>
                      )}
                    </div>
                    <Divider />
                    {commentingPost?.id === post.id && <Comments />}
                  </Card>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : (
          <Snackbar open={true} message="投稿がありません" />
        )}
      </div>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default TimeLine;
