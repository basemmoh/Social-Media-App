import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

export interface PublicUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  cover?: string;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean; 
}

export async function getUserProfile(userId: string) {
  const res = await axiosInterceptors.get<{ data: { user: PublicUser } }>(
    `/users/${userId}/profile`,
  );
  return res.data.data.user;
}