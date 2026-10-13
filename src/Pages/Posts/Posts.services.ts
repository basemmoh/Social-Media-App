import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { AllPostsResponseType } from "./Posts.interface";

export async function getAllPosts(page: number): Promise<AllPostsResponseType> {
  const res = await axiosInterceptors.get<AllPostsResponseType>(`/posts`, {
    params: {
      page,
    },
  });
    return res.data;
}
