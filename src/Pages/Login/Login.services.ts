import axios from "axios";
import type { LoginResponseType, UserLoginDataType } from "./Login.interface";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

export async function sendUserDataLogin(userData: UserLoginDataType) {
  try {
    const response = await axiosInterceptors.post<LoginResponseType>(`/users/signin`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      throw new Error(error.response?.data.message);
    }
    throw new Error("Error Error");
  }
}
