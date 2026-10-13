import type { Post } from "./Posts.interface";

export interface PostsPage {
  posts: Post[];
  currentPage: number;
  numberOfPages: number;
  total: number;
}
