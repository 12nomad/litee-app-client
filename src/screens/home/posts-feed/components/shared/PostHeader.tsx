import moment from 'moment';
import { Link } from 'react-router-dom';
import { AiOutlineRetweet, AiFillDelete } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BiBookmarkAltPlus, BiSolidBookmarkAltPlus } from 'react-icons/bi';
import { Dropdown } from 'flowbite-react';

import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import {
  useDeletePostMutation,
  useToggleSavePostMutation,
} from '../../../../../store/features/api.slice';
import { setPostInputModalOpen } from '../../../../../store/features/post.slice';
import ConfirmationModal from './ConfirmationModal';
import ProfileImage from '../../../../../components/ui/ProfileImage';

interface IPostHeader {
  isRepost: boolean;
  username: string;
  createdAt: Date;
  userId: number;
  postId: number;
  profileImage?: string;
}

const PostHeader = ({
  isRepost,
  createdAt,
  username,
  userId,
  postId,
  profileImage,
}: IPostHeader) => {
  const user = useAppSelector((s) => s.user.user);
  const [deletePost, { isLoading }] = useDeletePostMutation();
  const [savePost] = useToggleSavePostMutation();
  const dispatch = useAppDispatch();

  const onToggleSavePost = () => savePost({ postId });

  const onDeletePost = async () => {
    const result = await deletePost({ postId });

    if (!('error' in result)) {
      window.location.reload();
    }
  };

  const onCloseModal = () =>
    dispatch(
      setPostInputModalOpen({
        val: false,
        element: undefined,
      }),
    );

  const onDelete = () => {
    dispatch(
      setPostInputModalOpen({
        val: true,
        element: (
          <ConfirmationModal
            onCloseModal={onCloseModal}
            isLoading={isLoading}
            onMutation={onDeletePost}
            title="Delete post?"
            buttonLabel="Delete"
          />
        ),
      }),
    );
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="md:hidden">
          <ProfileImage src={profileImage} size={8} />
        </div>
        <p className="md:hidden">
          {' '}
          <sup>.</sup>{' '}
        </p>
        <Link
          to={`/profile/${username}`}
          className="text-purple-eminence font-medium hover:underline"
        >
          {username}
        </Link>
        <p>
          {' '}
          <sup>.</sup>{' '}
        </p>
        <p>{moment(createdAt).fromNow()}</p>
        {isRepost && (
          <>
            <p>
              {' '}
              <sup>.</sup>{' '}
            </p>
            <div className="flex items-center gap-1 text-green-jade">
              <AiOutlineRetweet size={18} />
              repost
            </div>
          </>
        )}
      </div>

      <Dropdown
        inline
        dismissOnClick
        arrowIcon={false}
        className="dark:bg-black-rich-tint text-white-powder text-xs"
        placement="bottom-end"
        label={
          <BiDotsHorizontalRounded className="text-white-powder" size={22} />
        }
      >
        <Dropdown.Item onClick={onToggleSavePost}>
          {user && user.savedPosts.findIndex((el) => el.id === postId) < 0 ? (
            <span className="flex items-center truncate text-sm gap-1">
              <BiBookmarkAltPlus size={18} />
              Save
            </span>
          ) : (
            <span className="flex items-center truncate text-sm gap-1">
              <BiSolidBookmarkAltPlus size={18} />
              Saved
            </span>
          )}
        </Dropdown.Item>

        {userId === user?.id && (
          <Dropdown.Item onClick={onDelete}>
            <span className="flex items-center truncate text-sm gap-1 text-rose-700">
              <AiFillDelete size={18} />
              Delete
            </span>
          </Dropdown.Item>
        )}
      </Dropdown>
      {/* <div>
        <button
          type="button"
          className="px-2 py-1 bg-black-rich text-white-powder text-xs rounded-md font-medium hover:bg-purple-eminence"
        >
          Follow
        </button>
      </div> */}
    </div>
  );
};

export default PostHeader;
