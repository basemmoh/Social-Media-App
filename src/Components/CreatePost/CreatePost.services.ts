import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { CreatePostResponse } from "./CreatePost.interface";

export async function createPost(data: FormData) {
  const response = await axiosInterceptors.post<CreatePostResponse>(
    `/posts`,
    data,
  );
  return response.data.message;
}
