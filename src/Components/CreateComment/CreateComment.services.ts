import type { CreateCommentResponse } from "./CreateComment.interface";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

export async function createUserComment(data: FormData, postId: string) {
  const res = await axiosInterceptors.post<CreateCommentResponse>(
    `/posts/${postId}/comments`,
    data,
  );

  return res.data.message;
}
