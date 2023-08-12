import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  name?: string;
  description?: string;
  profileImage?: string;
  profileBackgroundImage?: string;
  savedPosts: { id: number }[];
}

const initialState: { user: User | null } = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (_, action: PayloadAction<{ user: User }>) => ({
      user: action.payload.user,
    }),
    addSavedPost: (store, action: PayloadAction<{ postId: number }>) => {
      if (store.user) {
        if (
          store.user.savedPosts.findIndex(
            (el) => el.id === action.payload.postId,
          ) < 0
        ) {
          store.user.savedPosts.push({ id: action.payload.postId });
        } else {
          store.user.savedPosts = store.user.savedPosts.filter(
            (el) => el.id !== action.payload.postId,
          );
        }
      }
    },
    clearUser: () => ({ user: null }),
  },
});

export const { addUser, clearUser, addSavedPost } = userSlice.actions;
export default userSlice.reducer;
