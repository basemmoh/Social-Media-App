import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { DeletePostResponseType } from "./DeletePost.interface";

export async function deletePost(postId: string) {
  try {
    const res = await axiosInterceptors.delete<DeletePostResponseType>(
      `/posts/${postId}`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
    throw new Error("Something went wrong");
  }
}