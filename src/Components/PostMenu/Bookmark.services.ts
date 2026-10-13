import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { BookmarkResponseType } from "./Bookmark.interface";

export async function toggleBookmark(postId: string) {
  try {
    const res = await axiosInterceptors.put<BookmarkResponseType>(
      `/posts/${postId}/bookmark`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
    throw new Error("Something went wrong");
  }
}