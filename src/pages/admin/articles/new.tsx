import React, { useEffect, useState } from "react";
import styles from "../../../components/common/markdown.module.scss";
import { Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { apiLocalhost } from "@/utils/urls/server";
import { createSuccess } from "@/redux/reducers/article";
import Router from "next/router";
import { Article } from "@/utils/types";
import Editor from "@/components/articles/editor";

export const MarkdownEditor = () => {
  const { editingArticle } = useSelector(
    (state: RootState) => state.articleReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  useEffect(() => {
    if (!currentUser?.admin) {
      alert("管理者権限がありません");

      // トップページにリダイレクトする
      Router.push("/");
    }
  }, []);
  const { onEditing } = editingArticle;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const onCreateArticleHandler = () => {
    setModalOpen(true);
  };
  const onSubmitCreateArticle = async (data: any) => {
    setModalOpen(false);
    const article: Article = await apiLocalhost
      .post("/articles", { article: data })
      .then((res) => res.data.article);
    dispatch(createSuccess(article));
    reset();
  };
  const { register, handleSubmit, reset } = useForm();

  return (
    <>
      <Modal open={modalOpen} style={{ width: "50%", margin: "0 auto" }}>
        <div>
          <button onClick={() => setModalOpen(false)}>閉じる</button>
          <p>記事の情報を入力してください</p>
          <form
            onSubmit={handleSubmit(onSubmitCreateArticle)}
            className={styles.commentFormContainer}
          >
            <input
              id="filled-basic"
              placeholder="タイトル"
              {...register("title", { required: true })}
            />
            <select
              {...register("genre", { required: true })}
              defaultValue="blog"
            >
              <option value="dev">dev</option>
              <option value="blog">blog</option>
            </select>

            <button onClick={onCreateArticleHandler}>作成</button>
          </form>
        </div>
      </Modal>
      {!onEditing && (
        <button onClick={onCreateArticleHandler}>記事を作成する</button>
      )}
      {onEditing && <Editor />}
    </>
  );
};

export default MarkdownEditor;
