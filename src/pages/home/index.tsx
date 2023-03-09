import ArticleCardSmall from "@/components/articles/articleCardSmall";
import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { GetStaticProps } from "next";
import React from "react";
import styles from "../../components/articles/articles.module.scss";

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
  console.log(articles);
  return (
    <>
      <div className={styles.miniCardWrapper}>
        {articles &&
          articles.map((article, index) => (
            <ArticleCardSmall article={article} key={index} />
          ))}
      </div>
    </>
  );
};

export default index;
