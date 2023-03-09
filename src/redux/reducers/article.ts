import { Article } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

type ArticleState = {
  editingArticle: {
    onEditing: boolean;
    article: Article | undefined;
  };
};

const initialState: ArticleState = {
  editingArticle: { onEditing: false, article: undefined },
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    createSuccess: (state, action) => {
      state.editingArticle.article = action.payload;
      state.editingArticle.onEditing = true;
      return state;
    },
    updateSuccess: (state, action) => {
      state.editingArticle.article = action.payload;
      return state;
    },
    changeEditing: (state, action) => {
      state.editingArticle.onEditing = action.payload;
      return state;
    },
  },
});

export const { createSuccess, updateSuccess, changeEditing } =
  articleSlice.actions;

export default articleSlice.reducer;
