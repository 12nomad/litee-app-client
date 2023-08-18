import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, addSavedPost } from './user.slice';
import { Comment, Post } from './post.slice';
import { io } from 'socket.io-client';
import { EVENTS } from '../../data/event.constant';
import { toast } from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';

export type NotifType = 'FOLLOW' | 'LIKE' | 'REPLY' | 'MESSAGE' | 'REPOST';

export interface CommonOutput {
  success: boolean;
}

export interface Notifications {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  notifType: NotifType;
  typeId?: number;
  viewed: boolean;
  notifFrom: User;
  notifFromId: number;
  notifTo: User;
  notifToId: number;
}

export interface Message {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  message: string;
  latestIn?: Room;
  readBy: User[];
  room: Room;
  roomId: number;
  sender: User;
  senderId: number;
}

export interface Room {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  roomName?: string;
  isGroupRoom: boolean;
  seenBy: User[];
  users: User[];
  messages: Message[];
  latestMessage?: Message;
  messageId?: number;
}

interface ExtendedUser extends Omit<User, 'savedPosts'> {
  _count: {
    following: number;
    followers: number;
    posts: number;
  };
  posts: Post[];
  savedPosts: Post[];
  followers: { id: number }[];
}

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  reconnection: true,
  autoConnect: false,
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // TODO: user
    getAuthUser: builder.query<User, void>({
      query: () => 'users',
      keepUnusedDataFor: 0,
    }),
    searchUserByUsername: builder.query<User[], { username: string }>({
      query: ({ username }) => `users/search-user?username=${username}`,
      keepUnusedDataFor: 0,
    }),
    getUserByUsername: builder.query<ExtendedUser, { username: string }>({
      query: ({ username }) => `users/${username}`,
      keepUnusedDataFor: 0,
    }),
    toggleFollow: builder.mutation<
      CommonOutput,
      { id: number; authUserId: number; username: string }
    >({
      query: ({ id }) => ({
        url: 'users/follow-user',
        method: 'PATCH',
        body: { id },
      }),
      async onQueryStarted(
        { authUserId, username },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getUserByUsername',
            { username },
            (draft) => {
              if (draft.followers.findIndex((el) => el.id === authUserId) < 0) {
                draft.followers.push({ id: authUserId });
                draft._count.followers += 1;
              } else {
                draft.followers = draft.followers.filter(
                  (el) => el.id !== authUserId,
                );
                draft._count.followers -= 1;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    editUser: builder.mutation<
      CommonOutput,
      {
        name: string;
        description: string;
        profileImage: string;
        username: string;
      }
    >({
      query: (data) => ({
        url: 'users/edit-user',
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(
        { description, name, profileImage, username },
        { dispatch, queryFulfilled },
      ) {
        const patchUserResult = dispatch(
          api.util.updateQueryData(
            'getUserByUsername',
            { username },
            (draft) => {
              draft.username = username;
              draft.description = description;
              draft.profileImage = profileImage;
              draft.name = name;
            },
          ),
        );
        const patchAuthUserResult = dispatch(
          api.util.updateQueryData('getAuthUser', undefined, (draft) => {
            draft.username = username;
            draft.description = description;
            draft.profileImage = profileImage;
            draft.name = name;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchUserResult.undo();
          patchAuthUserResult.undo();
        }
      },
    }),

    // TODO: auth
    login: builder.mutation<
      CommonOutput,
      { email?: string; username?: string; password: string }
    >({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<
      CommonOutput,
      { email: string; username: string; password: string }
    >({
      query: (data) => ({
        url: 'auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    passwordReset: builder.mutation<CommonOutput, { email: string }>({
      query: (data) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyReset: builder.mutation<
      CommonOutput,
      { email: string; reset: string }
    >({
      query: (data) => ({
        url: 'auth/verify-reset',
        method: 'POST',
        body: data,
      }),
    }),
    updatePassword: builder.mutation<
      CommonOutput,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: 'auth/update-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<CommonOutput, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),

    // TODO: post
    getFeedPosts: builder.query<
      Post[],
      { page?: number; setNewItemsCount?: Dispatch<SetStateAction<number>> }
    >({
      query: ({ page }) => `posts?page=${page || 1}`,
      keepUnusedDataFor: 0,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg: { setNewItemsCount } }) => {
        if (setNewItemsCount && newItems)
          setNewItemsCount && setNewItemsCount(newItems.length);

        return [...currentCache, ...newItems];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    getPostById: builder.query<Post, { id: number }>({
      query: (data) => ({
        url: `posts/${data.id}`,
      }),
      keepUnusedDataFor: 0,
    }),
    createPost: builder.mutation<
      CommonOutput,
      { description: string; media: string }
    >({
      query: (data) => ({
        url: 'posts/create-post',
        method: 'POST',
        body: data,
      }),
    }),
    toggleLike: builder.mutation<
      CommonOutput,
      { postId: number; authUserId?: number }
    >({
      query: ({ postId }) => ({
        url: 'posts/toggle-like',
        method: 'PATCH',
        body: { postId },
      }),
      async onQueryStarted(
        { postId, authUserId },
        { dispatch, queryFulfilled },
      ) {
        const patchFeedPostsResult = dispatch(
          api.util.updateQueryData('getFeedPosts', {}, (draft) => {
            draft.map((post) => {
              if (post.id === postId) {
                if (post.likes.findIndex((el) => el.id === authUserId) < 0) {
                  post._count.likes += 1;
                  post.likes = [...post.likes, { id: authUserId || 0 }];
                } else {
                  post._count.likes -= 1;
                  post.likes = post.likes.filter((el) => el.id !== authUserId);
                }
              }
            });
          }),
        );
        const patchPostResult = dispatch(
          api.util.updateQueryData('getPostById', { id: postId }, (draft) => {
            if (draft.likes.findIndex((el) => el.id === authUserId) < 0) {
              draft._count.likes += 1;
              draft.likes = [...draft.likes, { id: authUserId || 0 }];
            } else {
              draft._count.likes -= 1;
              draft.likes = draft.likes.filter((el) => el.id !== authUserId);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchFeedPostsResult.undo();
          patchPostResult.undo();
        }
      },
    }),
    repost: builder.mutation<
      CommonOutput,
      {
        postId: number;
        comment: string;
        authUserId?: number;
      }
    >({
      query: ({ comment, postId }) => ({
        url: 'posts/repost',
        method: 'POST',
        body: { comment, postId },
      }),
      async onQueryStarted(
        { postId, authUserId },
        { dispatch, queryFulfilled },
      ) {
        const patchFeedPostsResult = dispatch(
          api.util.updateQueryData('getFeedPosts', {}, (draft) => {
            draft.map((post) => {
              if (post.id === postId) {
                post._count.repostUsers += 1;
                post.repostUsers = [
                  ...post.repostUsers,
                  { id: authUserId || 0 },
                ];
              }
            });
          }),
        );
        const patchPostResult = dispatch(
          api.util.updateQueryData('getPostById', { id: postId }, (draft) => {
            draft._count.repostUsers += 1;
            draft.repostUsers = [...draft.repostUsers, { id: authUserId || 0 }];
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchFeedPostsResult.undo();
          patchPostResult.undo();
        }
      },
    }),
    undoRepost: builder.mutation<
      CommonOutput,
      {
        postId: number;
        authUserId?: number;
      }
    >({
      query: ({ postId }) => ({
        url: 'posts/undo-repost',
        method: 'POST',
        body: { postId },
      }),
      async onQueryStarted(
        { postId, authUserId },
        { dispatch, queryFulfilled },
      ) {
        const patchFeedPostsResult = dispatch(
          api.util.updateQueryData('getFeedPosts', {}, (draft) => {
            draft.map((post) => {
              if (post.id === postId) {
                post._count.repostUsers -= 1;
                post.repostUsers = post.repostUsers.filter(
                  (el) => el.id !== authUserId,
                );
              }
            });
          }),
        );
        const patchPostResult = dispatch(
          api.util.updateQueryData('getPostById', { id: postId }, (draft) => {
            draft._count.repostUsers -= 1;
            draft.repostUsers = draft.repostUsers.filter(
              (el) => el.id !== authUserId,
            );
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchFeedPostsResult.undo();
          patchPostResult.undo();
        }
      },
    }),
    commentPost: builder.mutation<
      Comment,
      {
        postId: number;
        comment: string;
        authUserId?: number;
      }
    >({
      query: ({ comment, postId }) => ({
        url: 'posts/comment-post',
        method: 'POST',
        body: { comment, postId },
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getFeedPosts', {}, (draft) => {
              draft.map((post) => {
                if (post.id === postId) {
                  post._count.comments += 1;
                  post.comments = [data, ...post.comments];
                }
              });
            }),
          );
          dispatch(
            api.util.updateQueryData('getPostById', { id: postId }, (draft) => {
              draft._count.comments += 1;
              draft.comments.unshift(data);
            }),
          );
        } catch {
          return;
        }
      },
    }),
    deletePost: builder.mutation<
      CommonOutput,
      {
        postId: number;
      }
    >({
      query: ({ postId }) => ({
        url: 'posts',
        method: 'DELETE',
        body: { postId },
      }),
    }),
    toggleSavePost: builder.mutation<
      CommonOutput,
      {
        postId: number;
      }
    >({
      query: (data) => ({
        url: 'posts/save-post',
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(addSavedPost({ postId }));
        } catch {
          return;
        }
      },
    }),

    // TODO: room
    createRoom: builder.mutation<CommonOutput, { usersArray: string[] }>({
      query: (data) => ({
        url: 'rooms',
        method: 'POST',
        body: data,
      }),
    }),
    editRoomName: builder.mutation<
      CommonOutput,
      { roomId: number; title: string }
    >({
      query: (data) => ({
        url: 'rooms/edit-room',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ roomId, title }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getRoom', { id: roomId }, (draft) => {
            draft.roomName = title;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    editLatestMessage: builder.mutation<
      CommonOutput,
      { roomId: number; senderId: number }
    >({
      query: ({ roomId, senderId }) => ({
        url: 'rooms/edit-latest-message',
        method: 'POST',
        body: { roomId, senderId },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getMessageNotifsCount',
            undefined,
            (draft) => --draft,
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getRooms: builder.query<Room[], { userId: number }>({
      query: () => 'rooms',
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        { userId },
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        try {
          await cacheDataLoaded;

          socket.on<`${EVENTS}`>('INCOMING_MESSAGE', (message: Message) => {
            updateCachedData((draft) => {
              draft.map((room) => {
                if (room.id === message.roomId) {
                  room.latestMessage = message;
                  // room.hasSeenLatestMessage = false;
                  room.seenBy = room.seenBy.filter((el) => el.id !== userId);
                }
              });
            });
          });

          await cacheEntryRemoved;
        } catch {
          return;
        }
      },
    }),
    getRoom: builder.query<Room, { id: number }>({
      query: ({ id }) => `rooms/${id}`,
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        try {
          await cacheDataLoaded;

          socket.on<`${EVENTS}`>('INCOMING_MESSAGE', (message: Message) => {
            updateCachedData((draft) => {
              if (
                draft.id === message.roomId &&
                draft.messages.findIndex((el) => el.id === message.id) < 0
              ) {
                draft.messages.push(message);
                draft.latestMessage = message;
              }
            });
          });

          await cacheEntryRemoved;
        } catch {
          return;
        }
      },
    }),
    getRoomByUserId: builder.query<Room, { userId: number }>({
      query: ({ userId }) => `rooms/room?id=${userId}`,
      keepUnusedDataFor: 0,
    }),

    // TODO: message
    createMessage: builder.mutation<
      Message,
      { roomId: number; message: string }
    >({
      query: (data) => ({
        url: 'messages',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ roomId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getRoom', { id: roomId }, (draft) => {
              if (draft.id === roomId) {
                draft.messages.push(data);
                // draft.hasSeenLatestMessage = false;
                draft.seenBy = [];
                draft.latestMessage = data;
              }
            }),
          );
        } catch {
          return;
        }
      },
    }),

    // TODO: notification
    getNotifs: builder.query<Notifications[], void>({
      query: () => 'notifications',
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        try {
          await cacheDataLoaded;

          socket.on<`${EVENTS}`>(
            'NEW_FOLLOW',
            (data: { notif: Notifications }) => {
              updateCachedData((draft) => {
                draft.unshift(data.notif);
              });
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_LIKE',
            (data: { notif: Notifications }) => {
              updateCachedData((draft) => {
                draft.unshift(data.notif);
              });
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_REPOST',
            (data: { notif: Notifications }) => {
              updateCachedData((draft) => {
                draft.unshift(data.notif);
              });
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_REPLY',
            (data: { notif: Notifications }) => {
              updateCachedData((draft) => {
                draft.unshift(data.notif);
              });
            },
          );

          await cacheEntryRemoved;
        } catch {
          return;
        }
      },
    }),
    viewedNotif: builder.mutation<CommonOutput, { notifId: number }>({
      query: (data) => ({
        url: 'notifications',
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getNotifsCount',
            undefined,
            (draft) => draft - 1,
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteNotifs: builder.mutation<CommonOutput, void>({
      query: () => ({
        url: 'notifications',
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResultDelete = dispatch(
          api.util.updateQueryData('getNotifs', undefined, () => []),
        );
        const patchResultCount = dispatch(
          api.util.updateQueryData('getNotifsCount', undefined, () => 0),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResultDelete.undo();
          patchResultCount.undo();
        }
      },
    }),
    getNotifsCount: builder.query<number, void>({
      query: () => 'notifications/count',
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        try {
          await cacheDataLoaded;

          socket.on<`${EVENTS}`>(
            'NEW_FOLLOW',
            (data: { userId: number; username: string }) => {
              toast(`${data.username} started following you`);
              updateCachedData((draft) => ++draft);
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_LIKE',
            (data: { postId: number; username: string }) => {
              toast(`${data.username} liked your post`);
              updateCachedData((draft) => ++draft);
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_REPOST',
            (data: { postId: number; username: string }) => {
              toast(`${data.username} reposted your content`);
              updateCachedData((draft) => ++draft);
            },
          );

          socket.on<`${EVENTS}`>(
            'NEW_REPLY',
            (data: { postId: number; username: string }) => {
              toast(`${data.username} commented on your post`);
              updateCachedData((draft) => ++draft);
            },
          );

          await cacheEntryRemoved;
        } catch {
          return;
        }
      },
    }),
    getMessageNotifsCount: builder.query<number, void>({
      query: () => 'notifications/message-count',
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        try {
          await cacheDataLoaded;

          socket.on<`${EVENTS}`>('INCOMING_MESSAGE', (message: Message) => {
            if (
              !window.location.pathname.trim().startsWith('/messages/') &&
              !message.room.isGroupRoom
            ) {
              toast(`new message from ${message.sender.username}`);
              updateCachedData((draft) => ++draft);
            }
          });

          await cacheEntryRemoved;
        } catch {
          return;
        }
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useLoginMutation,
  useRegisterMutation,
  usePasswordResetMutation,
  useVerifyResetMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
  useCreatePostMutation,
  useGetFeedPostsQuery,
  useToggleLikeMutation,
  useRepostMutation,
  useUndoRepostMutation,
  useCommentPostMutation,
  useGetPostByIdQuery,
  useLazySearchUserByUsernameQuery,
  useDeletePostMutation,
  useToggleSavePostMutation,
  useGetUserByUsernameQuery,
  useToggleFollowMutation,
  useSearchUserByUsernameQuery,
  useEditUserMutation,
  useCreateRoomMutation,
  useGetRoomsQuery,
  useLazyGetRoomByUserIdQuery,
  useGetRoomByUserIdQuery,
  useGetRoomQuery,
  useEditRoomNameMutation,
  useCreateMessageMutation,
  useEditLatestMessageMutation,
  useGetMessageNotifsCountQuery,
  useGetNotifsCountQuery,
  useGetNotifsQuery,
  useViewedNotifMutation,
  useDeleteNotifsMutation,
} = api;
