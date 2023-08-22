import { useEffect, useRef, useState } from "react";

import { useGetFeedPostsQuery } from "../../../store/features/api.slice";
import ErrorHandler from "../../../components/ui/ErrorHandler";
import PostArticle from "./components/PostArticle";
import Spinner from "../../../components/ui/Spinner";
import Container from "../../../components/ui/Container";

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
      { threshold: 1 }
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
    <Container
      containerClass="relative w-full xl:w-3/4 pt-6 mx-auto no-scrollbar"
      tabTitle="Feed"
    >
      <div className="space-y-8">
        {isError && <ErrorHandler error={error} />}

        {!isLoading && data && data.length > 0 ? (
          data.map((post) => <PostArticle key={post.id} post={post} />)
        ) : (
          <></>
        )}

        <div ref={targetRef} className={isFetching ? "mt-12" : ""}></div>
      </div>

      {(isLoading || isFetching) && (
        <div className="absolute top-0 left-0 pt-12 z-10 h-full w-full bg-black-rich/20 grid place-content-center">
          <Spinner />
        </div>
      )}
    </Container>
  );
};

export default PostsFeed;
