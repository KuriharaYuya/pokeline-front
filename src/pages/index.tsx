import ActionIcons from "@/components/timeline/actionIcons";
import { Post } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { Alert, Card, CardActionArea, Snackbar } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../components/timeline/timeline.module.scss";
import { RootState } from "@/redux/store";

const TimeLine = () => {
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const { posts } = await apiLocalhost
        .get("/posts")
        .then((res) => res.data);
      setPosts(posts);
    })();
  }, []);

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };
  const handleClickMessageIcon = () => console.log("yes");
  const handleClickEditIcon = () => {};
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
                post.id === selectedPost?.id
                  ? styles.selectedPost
                  : styles.postCard
              }
              onClick={() => handlePostSelect(post)}
            >
              {post.id === selectedPost?.id && (
                <ActionIcons
                  {...actionIconsFuncs}
                  createdByCurrentUser={post.user_id === currentUser?.id}
                />
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
