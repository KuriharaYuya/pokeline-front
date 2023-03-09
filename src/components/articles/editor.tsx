import { uploadImageToCloudStorage } from "@/libs/firebase/storage";
import { updateSuccess } from "@/redux/reducers/article";
import { RootState } from "@/redux/store";
import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import MdEditor from "./mdEditor";

const Editor = () => {
  const { editingArticle } = useSelector(
    (state: RootState) => state.articleReducer
  );
  const dispatch = useDispatch();
  const { register, reset, handleSubmit } = useForm();

  const onSaveArticle = async (data: any, e: any) => {
    e.preventDefault();
    const updatedArticle = async () => {
      const { title, genre } = data as Article;
      if (data.img) {
        const imgUrl = await uploadImageToCloudStorage(data.img[0]);
        return {
          title,
          genre,
          content: editingArticle.article?.content,
          img: imgUrl,
        };
      } else {
        return { title, genre, content: editingArticle.article?.content };
      }
    };
    const updatedArticleData = await updatedArticle();

    const { id } = editingArticle.article!;
    const newArticle = await apiLocalhost
      .put(`/articles/${id}`, {
        article: updatedArticleData,
      })
      .then((res) => res.data.article);
    dispatch(updateSuccess(newArticle));
    reset();
  };

  return (
    <>
      {editingArticle.article && (
        <Image
          width={150}
          height={150}
          src={editingArticle.article.img}
          alt={editingArticle.article.title}
        />
      )}
      <form onSubmit={handleSubmit(onSaveArticle)}>
        <input
          placeholder="サムネイル画像"
          type="file"
          {...register("img", { required: true })}
        />
        <input
          id="filled-basic"
          placeholder="タイトル"
          defaultValue={editingArticle.article?.title}
          {...register("title", { required: true })}
        />
        <select
          {...register("genre", { required: true })}
          defaultValue={editingArticle.article?.genre}
        >
          <option value="dev">dev</option>
          <option value="blog">blog</option>
        </select>
        <MdEditor />
        <button type="submit">保存する</button>
      </form>
    </>
  );
};

export default Editor;
