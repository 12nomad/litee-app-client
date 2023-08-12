import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';

import { useGetFeedPostsQuery } from '../../../store/features/api.slice';
import Loading from '../../../components/ui/Loading';
import ErrorHandler from '../../../components/ui/ErrorHandler';
import PostArticle from './components/PostArticle';

const PostsFeed = () => {
  const [page, setPage] = useState<number>(1);
  const [newItemsCount, setNewItemsCount] = useState(1);
  const { data, isLoading, isFetching, error, isError } = useGetFeedPostsQuery({
    page,
    setNewItemsCount,
  });
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isFetching && !isLoading && newItemsCount > 0) {
            setPage((prev) => prev + 1);
            setNewItemsCount(0);
          }
        }
      },
      { threshold: 1 },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, isLoading, isFetching, newItemsCount]);

  return (
    <div className="w-full xl:w-3/4 mx-auto no-scrollbar">
      <Helmet>
        <title>Feed | Litee.</title>
      </Helmet>

      <div className="space-y-8">
        {isError && <ErrorHandler error={error} />}

        {!isLoading && data && data.length > 0 ? (
          data.map((post) => <PostArticle key={post.id} post={post} />)
        ) : (
          <></>
        )}

        {isLoading || (isFetching && <Loading />)}

        <div ref={targetRef} className={isFetching ? 'mt-12' : ''}></div>
      </div>
    </div>
  );
};

export default PostsFeed;
