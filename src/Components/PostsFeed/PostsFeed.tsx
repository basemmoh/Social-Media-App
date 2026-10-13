import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostsCard from "../PostsCard/PostsCard";
import Loading from "../Loading/Loading";
import CreatePost from "../CreatePost/CreatePost";
import SideMenu from "../SideMenu/SideMenu";
import SuggestedFriends from "../SuggestedFriends/SuggestedFriends";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useInfinitePostList } from "../../Hooks/useInfinitePostList/useInfinitePostList";
import type { PostsPage } from "../../Pages/Posts/PostsPage.types";
import FeedLayout from "../Layout/FeedLayout";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

function PostsFeed({
  title,
  queryKey,
  fetchPage,
  enabled = true,
  showComposer = false,
  emptyText,
}: {
  title: string;
  queryKey: readonly unknown[];
  fetchPage: (page: number) => Promise<PostsPage>;
  enabled?: boolean;
  showComposer?: boolean;
  emptyText: string;
}) {
  useDocumentTitle(title);
  const { userData } = useContext(userAuthContext);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfinitePostList(queryKey, fetchPage, enabled);

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  const all = data?.pages.flatMap((page) => page.posts) ?? [];
  const posts = [...new Map(all.map((p) => [p._id, p] as const)).values()];

  const visible = posts.filter((p) => p.body || p.image || p.sharedPost);
  const loading = isLoading || !enabled;

  return (
    <FeedLayout
      left={<SideMenu />}
      right={<SuggestedFriends />}
      top={
        <>
          <SideMenu grid />
          <SuggestedFriends collapsible />
        </>
      }
    >
      {showComposer && userData && <CreatePost userData={userData} />}

      {loading && <Loading />}

      {!loading && visible.length === 0 && (
        <p className="text-center text-gray-500 py-10">{emptyText}</p>
      )}

      {visible.map((e) => (
        <PostsCard key={e._id} post={e} />
      ))}

      <div ref={ref} />

      {isFetchingNextPage && (
        <p className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
          <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading more posts...
        </p>
      )}

      {isFetchNextPageError && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          className="mx-auto px-4 py-2 rounded border cursor-pointer"
        >
          Couldn't load more. Try again
        </button>
      )}

      {!hasNextPage && visible.length > 0 && (
        <p className="text-center text-gray-500">You're all caught up.</p>
      )}
    </FeedLayout>
  );
}

export default PostsFeed;
