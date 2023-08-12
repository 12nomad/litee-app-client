import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './user.slice';

interface Count {
  likes: number;
  repostUsers: number;
  comments: number;
}

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  comment: string;
  post: Post;
  postId: number;
  user: User;
  userId: number;
}

export interface Post {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  media?: string;
  pinned: boolean;
  isRepost: boolean;
  likes: { id: number }[];
  repostUsers: { id: number }[];
  comments: Comment[];
  _count: Count;
  user: User;
  userId: number;
  repost?: Post;
  repostId?: number;
}

const initialState: {
  posts: Post[];
  postInputModalOpen: boolean;
  modalChildren?: JSX.Element;
} = {
  posts: [],
  postInputModalOpen: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,

  reducers: {
    setPostInputModalOpen: (
      state,
      action: PayloadAction<{ val: boolean; element: JSX.Element | undefined }>,
    ) => ({
      posts: state.posts,
      postInputModalOpen: action.payload.val,
      modalChildren: action.payload.element,
    }),
  },
});

export const { setPostInputModalOpen } = postSlice.actions;
export default postSlice.reducer;
