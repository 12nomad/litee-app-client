import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AiOutlineComment } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';

import { useGetPostByIdQuery } from '../../../store/features/api.slice';
import Loading from '../../../components/ui/Loading';
import ErrorHandler from '../../../components/ui/ErrorHandler';
import PostFooter from '../posts-feed/components/shared/PostFooter';
import RepostHeader from '../posts-feed/components/shared/RepostHeader';
import { Avatar } from 'flowbite-react';
import moment from 'moment';
import PostMedia from '../posts-feed/components/shared/PostMedia';
import ProfileImage from '../../../components/ui/ProfileImage';

const ViewPost = () => {
  const { postId } = useParams<{ postId: string }>();

  // if(!postId || Boolean(+postId)) return <Navigate to='/' replace={true} />

  const navigate = useNavigate();

  const { data, isLoading, error } = useGetPostByIdQuery({
    id: postId ? +postId : 0,
  });

  if (isLoading) return <Loading />;

  if (error) return <ErrorHandler error={error} />;

  return !isLoading && data ? (
    <div className="w-3/4 mx-auto text-sm">
      <Helmet>
        <title>Post | Litee.</title>
      </Helmet>

      <article className="w-full ">
        <RepostHeader
          createdAt={data.createdAt}
          username={data.user.username}
          profileImage={data.user.profileImage}
          isRepost={data.isRepost}
        />

        <p>{data.description}</p>

        {data.media && (
          <PostMedia
            username={data.user.username}
            media={data.media}
            createdAt={data.createdAt}
          />
        )}
      </article>

      {data.isRepost && data.repost && (
        <div
          onClick={() => navigate(`/posts/${data.repostId}`)}
          className="w-full cursor-pointer  mt-4 p-4 text-sm rounded-md border border-black-rich-tint"
        >
          <RepostHeader
            profileImage={data.repost.user.profileImage}
            username={data.repost.user.username}
            createdAt={data.repost.createdAt}
          />
          <p>{data.repost.description}</p>
          {data.repost.media && (
            <PostMedia
              username={data.repost.user.username}
              media={data.repost.media}
              createdAt={data.repost.createdAt}
            />
          )}
        </div>
      )}

      <PostFooter post={data} />

      <div className="mt-6">
        <h2 className="flex items-center gap-2">
          <AiOutlineComment size={22} /> Comments
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>

        {data.comments.map((comment) => (
          <div className="mb-4" key={comment.id}>
            <div className="flex gap-3 text-sm">
              <div className="gird place-items-start">
                <ProfileImage src={comment.user.profileImage} size={10} />
              </div>

              <div>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-purple-eminence hover:underline cursor-pointer">
                    {comment.user.username}
                  </span>{' '}
                  <sup>.</sup> {comment.comment}
                </p>
                <div className="font-extralight text-xs">
                  {moment(comment.createdAt).fromNow()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ViewPost;
