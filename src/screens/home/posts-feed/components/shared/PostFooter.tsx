import { VscFlame } from 'react-icons/vsc';
import { AiOutlineRetweet, AiOutlineComment } from 'react-icons/ai';

import {
  Post,
  setPostInputModalOpen,
} from '../../../../../store/features/post.slice';
import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import {
  useToggleLikeMutation,
  useUndoRepostMutation,
} from '../../../../../store/features/api.slice';
import RepostInput from '../RepostInput';
import PostCommentInput from '../PostCommentInput';
import ConfirmationModal from './ConfirmationModal';

interface IPostFooter {
  post: Post;
}

const PostFooter = ({ post }: IPostFooter) => {
  const user = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();
  const [toggleLike] = useToggleLikeMutation();
  const [undoRepost, { isLoading: undoRepostLoading }] =
    useUndoRepostMutation();

  const onTogglePostLike = async (postId: number) => {
    await toggleLike({ postId, authUserId: user?.id });
  };

  const onCommentPost = async (
    postId: number,
    createdAt: Date,
    description: string,
    username: string,
    profileImage: string | undefined,
  ) => {
    dispatch(
      setPostInputModalOpen({
        val: true,
        element: (
          <PostCommentInput
            postId={postId}
            createdAt={createdAt}
            description={description}
            username={username}
            profileImage={profileImage}
          />
        ),
      }),
    );
  };

  const isReposted = post.repostUsers.findIndex((el) => el.id === user?.id) < 0;

  const onUndoRepost = async () => {
    const result = await undoRepost({
      postId: post.id,
      authUserId: user?.id,
    });

    if (!('error' in result)) {
      window.location.reload();
    }
  };

  const onCloseRepost = () =>
    dispatch(
      setPostInputModalOpen({
        val: false,
        element: undefined,
      }),
    );

  const onRepost = (
    postId: number,
    createdAt: Date,
    description: string,
    username: string,
    profileImage: string | undefined,
  ) => {
    if (!isReposted) {
      dispatch(
        setPostInputModalOpen({
          val: true,
          element: (
            <ConfirmationModal
              onCloseModal={onCloseRepost}
              isLoading={undoRepostLoading}
              onMutation={onUndoRepost}
              title="Undo repost?"
              buttonLabel="Undo"
            />
          ),
        }),
      );
    } else {
      dispatch(
        setPostInputModalOpen({
          val: true,
          element: (
            <RepostInput
              postId={postId}
              createdAt={createdAt}
              description={description}
              username={username}
              profileImage={profileImage}
            />
          ),
        }),
      );
    }
  };

  return (
    <div className="flex gap-6 mt-2">
      <div
        className={`flex items-center gap-2 ${
          post.likes.findIndex((el) => el.id === user?.id) < 0
            ? 'text-white-powder'
            : 'text-purple-eminence'
        }`}
      >
        <VscFlame
          size={22}
          className="cursor-pointer"
          onClick={() => onTogglePostLike(post.id)}
        />
        {post._count.likes > 0 && post._count.likes}
      </div>

      <div
        className={`flex items-center gap-2
        ${
          post.comments.findIndex((el) => el.userId === user?.id) < 0
            ? 'text-white-powder'
            : 'text-blue-cerulean'
        }
      `}
      >
        <AiOutlineComment
          size={22}
          onClick={() =>
            onCommentPost(
              post.id,
              post.createdAt,
              post.description,
              post.user.username,
              post.user.profileImage,
            )
          }
          className="cursor-pointer"
        />
        {post._count.comments > 0 && post._count.comments}
      </div>

      {!post.isRepost && (
        <div
          className={`flex items-center gap-2  ${
            isReposted ? 'text-white-powder' : 'text-green-jade'
          }`}
        >
          <AiOutlineRetweet
            size={22}
            className="cursor-pointer"
            onClick={() =>
              onRepost(
                post.id,
                post.createdAt,
                post.description,
                post.user.username,
                post.user.profileImage,
              )
            }
          />
          {post._count.repostUsers > 0 && post._count.repostUsers}
        </div>
      )}
    </div>
  );
};

export default PostFooter;
