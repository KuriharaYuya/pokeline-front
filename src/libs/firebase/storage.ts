import { generateUuid } from "@/utils/client";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

// 画像アップロード
export const uploadImageToCloudStorage = async (file: File) => {
  const storage = getStorage();
  //   拡張子はファイルのものを使用する
  const extension = file.name.split(".").pop() || "";
  //   ファイル名にはユニークなIDを付与する
  const fileName = `${generateUuid()}.${extension}`;
  const imageRef = ref(storage, fileName);
  // 画像ファイルをバイト列に変換してアップロード
  const uploadTask = uploadBytes(imageRef, file);

  // アップロードが完了した後、ダウンロードURLを取得して表示する
  return uploadTask.then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  });
};
