import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostsPage } from "../../Pages/Posts/PostsPage.types";

export function useInfinitePostList(
  queryKey: readonly unknown[],
  fetchPage: (page: number) => Promise<PostsPage>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.currentPage < last.numberOfPages ? last.currentPage + 1 : undefined,
    enabled,
  });
}