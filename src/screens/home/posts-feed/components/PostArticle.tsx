import { Post } from '../../../../store/features/post.slice';
import PostFooter from './shared/PostFooter';
import RepostHeader from './shared/RepostHeader';
import PostMedia from './shared/PostMedia';
import PostHeader from './shared/PostHeader';
import { useNavigate } from 'react-router-dom';

interface IPostArticle {
  post: Post;
}

const PostArticle = ({ post }: IPostArticle) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 text-sm ml-4 mr-5 md:ml-6 md:mr-8 lg:ml-14 lg:mr-16 xl:mx-0">
      <div className="hidden md:grid place-items-start">
        <img
          src={
            post.user.profileImage ||
            'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
          }
          alt={post.user.username + 'avatar'}
          className="w-[43px] h-[40px] object-cover rounded-full mt-[4px]"
        />
      </div>

      {post.isRepost ? (
        <article className="w-full">
          <PostHeader
            createdAt={post.createdAt}
            username={post.user.username}
            profileImage={post.user.profileImage}
            isRepost={post.isRepost}
            userId={post.userId}
            postId={post.id}
          />
          <p
            className="cursor-pointer mt-2 xl:mt-0"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.description}
          </p>
          {post.repost && (
            <div className="w-full mt-4 p-4 text-sm rounded-md border border-black-rich-tint">
              <RepostHeader
                profileImage={post.repost.user.profileImage}
                username={post.repost.user.username}
                createdAt={post.repost.createdAt}
              />
              <div
                onClick={() => navigate(`/posts/${post.repostId}`)}
                className="cursor-pointer"
              >
                <p>{post.repost.description}</p>
                {post.repost.media && (
                  <PostMedia
                    username={post.repost.user.username}
                    media={post.repost.media}
                    createdAt={post.repost.createdAt}
                  />
                )}
              </div>
            </div>
          )}
          <PostFooter post={post} />
        </article>
      ) : (
        <article className="w-full">
          <PostHeader
            createdAt={post.createdAt}
            profileImage={post.user.profileImage}
            username={post.user.username}
            isRepost={post.isRepost}
            userId={post.userId}
            postId={post.id}
          />

          <div
            onClick={() => navigate(`/posts/${post.id}`)}
            className="cursor-pointer"
          >
            <p className="mt-2 xl:mt-0">{post.description}</p>
            {post.media && (
              <PostMedia
                username={post.user.username}
                media={post.media}
                createdAt={post.createdAt}
              />
            )}
          </div>
          <PostFooter post={post} />
        </article>
      )}
    </div>
  );
};

export default PostArticle;
