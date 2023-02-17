import { Post, User } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

interface PostsState {
  posts: Post[] | undefined;
  selectedPost: { editing: boolean; post: Post | undefined };
}

const initialState: PostsState = {
  posts: undefined,
  selectedPost: { editing: false, post: undefined },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePosts: (state, actions) => {
      state.posts = actions.payload;
      return state;
    },
    updateSelectedPost: (state, actions) => {
      console.log(actions.payload, "あはは");
      state.selectedPost = actions.payload;
      return state;
    },
  },
});

export const { updatePosts, updateSelectedPost } = postsSlice.actions;

export default postsSlice.reducer;
