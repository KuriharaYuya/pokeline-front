import { RootState } from "@/redux/store";
import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Articles = () => {
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const [articles, setArticles] = useState<Article[] | undefined>(undefined);
  useEffect(() => {
    if (!currentUser?.admin) {
      alert("管理者権限がありません");

      // トップページにリダイレクトする
      Router.push("/");
      return;
    } else {
      (async () => {
        const articles = await apiLocalhost
          .get("/articles")
          .then((res) => res.data.articles);
        setArticles(articles);
      })();
    }
  }, []);
  return (
    <div>
      {articles &&
        articles.map((article, index) => (
          <p
            onClick={() => Router.push(`/admin/articles/${article.id}`)}
            key={index}
          >
            <p>タイトル: {article.title}</p>
            <p>投稿: {article.published ? "はい" : "いいえ"}</p>
          </p>
        ))}
    </div>
  );
};

export default Articles;
