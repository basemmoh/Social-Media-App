import type { AllCommentsResponse } from "./Comments.interface";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

export async function getAllComments(postId: string) {
  const response = await axiosInterceptors.get<AllCommentsResponse>(
    `/posts/${postId}/comments?page=1&limit=10`,
  );

  return response.data.data.comments;
}
