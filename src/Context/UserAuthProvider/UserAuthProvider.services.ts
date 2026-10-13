import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type {
  UserData,
  USerDataResponseType,
} from "./UserAuthProvider.inteface";

export async function getUserData(): Promise<null | UserData> {
  try {
    const res =
      await axiosInterceptors.get<USerDataResponseType>(`/users/profile-data`);
    return res.data.data.user;
  } catch (error) {
    return null;
  }
}
