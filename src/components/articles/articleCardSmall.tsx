import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Article } from "@/utils/types";
type Props = {
  article: Article;
};
import styles from "./articles.module.scss";
import Router from "next/router";

const ArticleCardSmall = ({ article }: Props) => {
  const limitText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <Card
      className={styles.miniCard}
      onClick={() => Router.push(`/articles/${article.id}`)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={article.img}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {article.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ wordWrap: "break-word" }}
          >
            {article.content && limitText(article.content, 82)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCardSmall;
