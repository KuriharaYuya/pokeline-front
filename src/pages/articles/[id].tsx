import MarkdownPreview from "@/components/articles/preview";
import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import React from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const articles: Article[] = await apiLocalhost
    .get(`/articles`)
    .then((res) => res.data.articles);
  const paths = articles.map((article) => ({
    params: { id: article.id },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.id as string;
  const article: Article = await apiLocalhost
    .get(`/articles/${id}`)
    .then((res) => res.data.article);
  return {
    props: {
      article,
    },
    revalidate: 60, // 60秒ごとに再生成
  };
};

type Props = {
  article: Article;
};
const PublishedArticleDetail = ({ article }: Props) => {
  return (
    <>
      <Image height={150} width={300} src={article.img} alt="article image" />
      <h1>{article.title}</h1>
      <div>{article.genre}</div>
      <p>{article.updated_at}</p>
      <div>
        <MarkdownPreview markdown={article.content} />
      </div>
    </>
  );
};

export default PublishedArticleDetail;
