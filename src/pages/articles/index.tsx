import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { GetStaticProps } from "next";
import React from "react";
export const getStaticProps: GetStaticProps = async () => {
  const articles: Article | undefined = await apiLocalhost
    .get("/articles")
    .then((res) => res.data.articles);
  return {
    props: {
      articles,
    },
  };
};
type Props = {
  articles: Article[] | undefined;
};
const index = ({ articles }: Props) => {
  return (
    <>
      <div>
        {articles &&
          articles.length > 0 &&
          articles.map((article, index) => (
            <p key={index}>
              <p>タイトル: {article.title}</p>
              <p>投稿: {article.published ? "はい" : "いいえ"}</p>
            </p>
          ))}
      </div>
    </>
  );
};

export default index;
