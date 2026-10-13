import axios from "axios";
import type { RegisterResponseType, UserDataType } from "./register.interface";
import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";

export async function sendUserDataRegister(userData: UserDataType) {
  try {
   const response = await axiosInterceptors.post<RegisterResponseType>(`/users/signup`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      throw new Error(error.response?.data.message);
    }
    throw new Error("Error Erorr");
  }
}
