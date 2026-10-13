import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type { ChangePhotoResponseType } from "./Navbar.interface";

export async function handleChangeProfileImage(
  data: FormData,
): Promise<string> {
  const res = await axiosInterceptors.put<ChangePhotoResponseType>(
    `/users/upload-photo`,
    data,
  );
  return res.data.message;
}
