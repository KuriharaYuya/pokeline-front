import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../components/common/markdown.module.scss";
import { uploadImageToCloudStorage } from "@/libs/firebase/storage";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export const MarkdownEditor = () => {
  const [markdownValue, setMarkdownValue] = useState("Initial value");

  const onChange = (value: any) => {
    setMarkdownValue(value);
  };

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

  return (
    <SimpleMDE
      value={markdownValue}
      className={styles.editor}
      onChange={onChange}
      options={autoUploadImage}
    />
  );
};

export default MarkdownEditor;
