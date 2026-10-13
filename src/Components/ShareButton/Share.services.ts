import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { SharePostResponseType } from "./Share.interface";

export async function sharePost(postId: string, body: string) {
  try {
    const res = await axiosInterceptors.post<SharePostResponseType>(
      `/posts/${postId}/share`,
      body,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
    throw new Error("Something went wrong");
  }
}
