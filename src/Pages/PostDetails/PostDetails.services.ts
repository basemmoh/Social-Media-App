import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { Post, PostDetailsResponseType } from "./PostDetails.interface";

export async function getSinglePost(postId: string):Promise<Post> {
   const response = await axiosInterceptors.get<PostDetailsResponseType>(`/posts/${postId}`);
    return response.data.data.post;
    
}