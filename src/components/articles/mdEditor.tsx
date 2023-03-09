import { uploadImageToCloudStorage } from "@/libs/firebase/storage";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkdownPreview from "./preview";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import styles from "../common/markdown.module.scss";
import { updateSuccess } from "@/redux/reducers/article";

const MdEditor = () => {
  const { editingArticle } = useSelector(
    (state: RootState) => state.articleReducer
  );
  const dispatch = useDispatch();
  const { onEditing, article } = editingArticle;
  const uploadImageFunction = async (file: any, onSuccess: any) => {
    // fileを受け取り、cloud storageにアップロードする

    // 画像のURLが返ってくる
    const url = await uploadImageToCloudStorage(file);

    // マークダウンに画像を挿入する
    onSuccess(url);
  };
  const autoUploadImage = useMemo(() => {
    return {
      uploadImage: true,
      imageUploadFunction: uploadImageFunction,
    };
  }, []);

  const onChange = (value: string) => {
    dispatch(updateSuccess({ column: "content", value }));
  };
  return (
    <>
      <SimpleMDE
        value={article?.content}
        className={styles.editor}
        onChange={onChange}
        options={autoUploadImage}
      />
      {article?.content && <MarkdownPreview markdown={article?.content} />}
    </>
  );
};

export default MdEditor;
