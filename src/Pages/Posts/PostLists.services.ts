import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import { getAllPosts } from "./Posts.services";
import type { AllPostsResponseType, Post } from "./Posts.interface";
import type { PostsPage } from "./PostsPage.types";

interface Pagination {
  currentPage: number;
  numberOfPages: number;
  total: number;
}

export async function fetchAllPosts(page: number): Promise<PostsPage> {
  const res = await getAllPosts(page);
  const { currentPage, numberOfPages, total } = res.meta.pagination;
  return { posts: res.data.posts, currentPage, numberOfPages, total };
}

export async function fetchUserPosts(
  userId: string,
  page: number,
): Promise<PostsPage> {
  const res = await axiosInterceptors.get<{
    data: { posts: Post[] };
    meta: { pagination: Pagination };
  }>(`/users/${userId}/posts`, { params: { page, limit: 10 } });
  const { currentPage, numberOfPages, total } = res.data.meta.pagination;
  return { posts: res.data.data.posts, currentPage, numberOfPages, total };
}

export async function fetchBookmarks(page: number): Promise<PostsPage> {
  const res = await axiosInterceptors.get<{
    data: { bookmarks: Post[] };
    meta: { pagination: Pagination };
  }>("/users/bookmarks", { params: { page, limit: 10 } });
  const { currentPage, numberOfPages, total } = res.data.meta.pagination;
  return {
    posts: res.data.data.bookmarks.map((p) => ({ ...p, bookmarked: true })),
    currentPage,
    numberOfPages,
    total,
  };
}

// Community: my posts + the posts of people I follow
// GUESS: replace this with your real endpoint (see the note at the end)
export async function fetchCommunityPosts(page: number): Promise<PostsPage> {
  const res = await axiosInterceptors.get<AllPostsResponseType>("/posts/feed", {
    params: { only: "following", page, limit: 10 },
  });
  const { currentPage, numberOfPages, total } = res.data.meta.pagination;
  return { posts: res.data.data.posts, currentPage, numberOfPages, total };
}
