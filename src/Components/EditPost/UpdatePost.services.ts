import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { UpdatePostResponseType } from "./UpdatePost.interface";

export async function updatePost(
  postId: string,
  changes: { body?: string; image?: File | null; privacy?: string },
) {
  try {
    const formData = new FormData();
    if (changes.body !== undefined) formData.append("body", changes.body);
    if (changes.image) formData.append("image", changes.image);
    if (changes.privacy !== undefined) formData.append("privacy", changes.privacy);

    const res = await axiosInterceptors.put<UpdatePostResponseType>(
      `/posts/${postId}`,
      formData,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
    throw new Error("Something went wrong");
  }
}