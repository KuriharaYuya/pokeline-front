import { updateSuccess } from "@/redux/reducers/article";
import { RootState } from "@/redux/store";
import { Article } from "@/utils/types";
import { apiLocalhost } from "@/utils/urls/server";
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

  const onSaveArticle = (data: any, e: any) => {
    e.preventDefault();
    const { title, genre, content } = data as Article;
    const updatedArticle = {
      ...editingArticle.article,
      title,
      genre,
      content,
    };
    dispatch(updateSuccess(updatedArticle));
    const { id } = editingArticle.article!;
    apiLocalhost.put(`/articles/${id}`, {
      article: { title, genre, content },
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSaveArticle)}>
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
  );
};

export default Editor;
