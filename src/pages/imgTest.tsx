import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import React, { useState } from "react";

interface Props {
  file: File;
}

const ImgUploader = ({ file }: Props) => {
  const storage = getStorage();
  const imageRef = ref(storage, "test.jpg");

  const upload = () => {
    // 画像ファイルをバイト列に変換してアップロード
    const uploadTask = uploadBytes(imageRef, file);

    // アップロードが完了した後、ダウンロードURLを取得して表示する
    uploadTask.then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    });
  };

  return <button onClick={upload}>Upload</button>;
};

const MyComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setFile(file);
  };

  return (
    <div>
      {file && <ImgUploader file={file} />}
      <input type="file" onChange={onFileChange} />;
    </div>
  );
};
export default MyComponent;
