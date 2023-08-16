import { FormEvent, useRef, useState } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

import { useRepostMutation } from '../../../../store/features/api.slice';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import RepostHeader from './shared/RepostHeader';
import FormInput from './shared/FormInput';

interface IRepostInput {
  postId: number;
  username: string;
  profileImage?: string;
  createdAt: Date;
  description: string;
}

const RepostInput = ({
  createdAt,
  description,
  postId,
  profileImage,
  username,
}: IRepostInput) => {
  const [repost, { isLoading, error }] = useRepostMutation();
  const [commentError, setCommentError] = useState('');
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentError('');

    if (!commentRef.current?.value.trim()) {
      setCommentError('Please write a comment...');
      return;
    }

    const result = await repost({
      comment: commentRef.current?.value.trim() || '',
      postId,
      authUserId: user?.id,
    });

    if (!('error' in result)) {
      dispatch(setPostInputModalOpen({ val: false, element: undefined }));
      toast.success('Repost succeed!');
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 p-4 lg:w-1/2 xl:w-1/3 md:p-8 bg-black-rich rounded-md border border-black-rich-tint"
    >
      <div>
        <h2 className="flex items-center gap-2">
          <AiOutlineRetweet size={22} /> Repost
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      <FormInput
        placeholder="Feel free to add a comment or not..."
        buttonLabel="Repost"
        commentRef={commentRef}
        error={error}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        commentError={commentError}
        profileImage={user?.profileImage}
      />

      <div className="w-full mt-8 p-4 text-sm rounded-md border border-black-rich-tint">
        <RepostHeader
          profileImage={profileImage}
          username={username}
          createdAt={createdAt}
        />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RepostInput;
