import { Post } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import Image from "next/image";
import { useEffect, useState } from "react";

const TimeLine = () => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  useEffect(() => {
    // とりまuseStateで
    (async () => {
      const { posts } = await apiLocalhost
        .get("/posts")
        .then((res) => res.data);
      console.table(posts);
      setPosts(posts);
    })();
  }, []);
  return (
    <div>
      {posts && posts.length > 1 ? (
        posts.map((post, index) => {
          return (
            <div key={index}>
              <h2>{post.pokemon_name}</h2>
              <h3>{post.version_name}</h3>
              <Image
                src={post.pokemon_image}
                alt={post.pokemon_name}
                width={100}
                height={100}
              />
              <Image
                src={post.user_img}
                alt={post.user_name}
                width={100}
                height={100}
              />
              <p>{post.user_name} </p>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
            </div>
          );
        })
      ) : (
        <p>投稿はまだありません</p>
      )}
    </div>
  );
};
export default TimeLine;
