import { Post } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { Alert, Card, CardActionArea, Snackbar } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../components/timeline.module.scss";

const TimeLine = () => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const { posts } = await apiLocalhost
        .get("/posts")
        .then((res) => res.data);
      console.log(posts);
      setPosts(posts);
    })();
  }, []);
  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => {
          return (
            <Card key={index} className={styles.postCard}>
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
        <p>投稿はまだありません</p>
      )}
    </div>
  );
};
export default TimeLine;
