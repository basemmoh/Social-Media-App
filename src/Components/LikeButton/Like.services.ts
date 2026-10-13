import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { LikeResponseType } from "./Like.interface";

export async function toggleLike(postId: string) {
  const res = await axiosInterceptors.put<LikeResponseType>(
    `/posts/${postId}/like`,
  );
  return res.data;
}
