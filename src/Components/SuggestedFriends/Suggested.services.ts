import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type {
  FollowResponseType,
  SuggestionsResponseType,
} from "./Suggested.interface";

export async function getSuggestions(page: number) {
  const res = await axiosInterceptors.get<SuggestionsResponseType>(
    `/users/suggestions?page=${page}&limit=50`,
  );
  return res.data;
}

export async function followUser(userId: string) {
  try {
    const res = await axiosInterceptors.put<FollowResponseType>(
      `/users/${userId}/follow`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
    throw new Error("Something went wrong");
  }
}
