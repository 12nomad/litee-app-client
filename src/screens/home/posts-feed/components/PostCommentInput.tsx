import { AiOutlineComment } from 'react-icons/ai';
import { useRef, FormEvent } from 'react';
import toast from 'react-hot-toast';

import { useCommentPostMutation } from '../../../../store/features/api.slice';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import RepostHeader from './shared/RepostHeader';
import FormInput from './shared/FormInput';

interface IPostCommentInput {
  postId: number;
  username: string;
  profileImage?: string;
  createdAt: Date;
  description: string;
}

const PostCommentInput = ({
  postId,
  createdAt,
  description,
  username,
  profileImage,
}: IPostCommentInput) => {
  const [commentPost, { isLoading, error }] = useCommentPostMutation();
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await commentPost({
      comment: commentRef.current?.value.trim() || '',
      postId,
      authUserId: user?.id,
    });

    if (!('error' in result)) {
      dispatch(setPostInputModalOpen({ val: false, element: undefined }));
      toast.success('Comment added!');
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-1/3 p-8 bg-black-rich rounded-md border border-black-rich-tint"
    >
      <div>
        <h2 className="flex items-center gap-2">
          <AiOutlineComment size={22} /> Comment
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      <div className="w-full mb-8 p-4 text-sm rounded-md border border-black-rich-tint">
        <RepostHeader
          profileImage={profileImage}
          username={username}
          createdAt={createdAt}
        />
        <p>{description}</p>
      </div>

      <FormInput
        placeholder="Your comment..."
        buttonLabel="Confirm"
        commentRef={commentRef}
        error={error}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        profileImage={user?.profileImage}
      />
    </div>
  );
};

export default PostCommentInput;
