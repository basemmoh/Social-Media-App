import axios from "axios";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type {
    ChangePasswordPayload,
  ChangePasswordResponseType,
} from "./ChangePassword.interface";

export async function changePassword(payload: ChangePasswordPayload) {
  try {
    const response = await axiosInterceptors.patch<ChangePasswordResponseType>(
      `/users/change-password`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Something went wrong");
    }
    throw new Error("Something went wrong");
  }
}