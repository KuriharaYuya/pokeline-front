import ActionIcons from "@/components/timeline/actionIcons";
import { Post } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { Alert, Card, CardActionArea, Snackbar } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../components/timeline/timeline.module.scss";
import { RootState } from "@/redux/store";
import { updatePosts, updateSelectedPost } from "@/redux/reducers/posts";

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
  const handleClickMessageIcon = () => console.log("yes");
  const handleClickEditIcon = () => {
    if (selectedPost.post === undefined) return;
    dispatch(updateSelectedPost({ ...selectedPost, editing: true }));
  };
  const handleClickDeleteIcon = () => {};
  const actionIconsFuncs = {
    handleClickMessageIcon,
    handleClickEditIcon,
    handleClickDeleteIcon,
  };

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => {
          return (
            <Card
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
                    createdByCurrentUser={post.user_id === currentUser?.id}
                  />
                  {selectedPost.editing === true && "aaa"}
                </>
              )}
              <CardActionArea>
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
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                </div>
              </CardActionArea>
            </Card>
          );
        })
      ) : (
        <Snackbar open={true} message="投稿がありません" />
      )}
    </div>
  );
};
export default TimeLine;
