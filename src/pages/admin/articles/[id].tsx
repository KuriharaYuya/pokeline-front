import Router, { useRouter } from "next/router";
import { apiLocalhost } from "@/utils/urls/server";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSuccess } from "@/redux/reducers/article";
import { RootState } from "@/redux/store";
import Editor from "@/components/articles/editor";
import { Switch } from "@mui/material";
import ConfirmationModal from "@/components/common/confirmationModal";

const EditArticleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { editingArticle } = useSelector(
    (state: RootState) => state.articleReducer
  );
  const dispatch = useDispatch();

  // useEffectでデータを取得する
  useEffect(() => {
    (async () => {
      if (id) {
        const tgtArticle = await apiLocalhost
          .get(`/articles/${id}`)
          .then((res) => res.data.article);
        // それをreduxのstoreに保存する
        dispatch(updateSuccess(tgtArticle));
      }
    })();
  }, [id]);
  const published = editingArticle.article?.published;
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [open, setOpen] = React.useState(false);
  const handleModalClose = () => {
    setOpen(false);
  };
  const onSwitchChange = () => {
    setOpen(true);
  };
  const handlePublication = async () => {
    await apiLocalhost.put(`/articles/${id}`, {
      article: { published: !published },
    });
    Router.push("/admin/articles");
  };
  return (
    <>
      <Editor />
      <p>投稿する</p>
      <Switch {...label} checked={published} onChange={onSwitchChange} />
      <ConfirmationModal
        handleClose={handleModalClose}
        confirmationTxt={published ? "非公開にしますか？" : "公開しますか？"}
        execFunc={handlePublication}
        open={open}
      />
    </>
  );
};

export default EditArticleDetail;
