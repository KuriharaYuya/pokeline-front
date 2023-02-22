import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

import React from "react";

const imgTest = () => {
  const storage = getStorage();
  const imageRef = ref(storage, "test.jpg");
  const upload = () => {
    // 画像ファイルを取得
    const imageFile = require("../../public/test.jpeg");
    // 画像ファイルをバイト列に変換してアップロード
    const uploadTask = uploadBytes(imageRef, imageFile);

    // アップロードが完了した後、ダウンロードURLを取得して表示する
    uploadTask.then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    });
  };
  return <button onClick={upload}>あげry</button>;
};

export default imgTest;
