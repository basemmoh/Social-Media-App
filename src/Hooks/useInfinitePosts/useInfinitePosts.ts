import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../Pages/Posts/Posts.services";

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: ({ pageParam }) => getAllPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } = lastPage.meta.pagination;
      return currentPage < numberOfPages ? currentPage + 1 : undefined;
    },
  });
}
