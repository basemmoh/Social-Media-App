import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

function toError(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return new Error(error.response?.data?.message ?? error.message);
  }
  return new Error("Something went wrong");
}

export async function uploadPhoto(file: File) {
  try {
    const form = new FormData();
    form.append("photo", file);
    const res = await axiosInterceptors.put<{ message: string }>(
      "/users/upload-photo",
      form,
    );
    return res.data.message;
  } catch (error) {
    throw toError(error);
  }
}

export async function uploadCover(file: File) {
  try {
    const form = new FormData();
    form.append("cover", file);
    const res = await axiosInterceptors.put<{ message: string }>(
      "/users/upload-cover",
      form,
    );
    return res.data.message;
  } catch (error) {
    throw toError(error);
  }
}
