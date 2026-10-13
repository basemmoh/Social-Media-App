import * as zod from "zod";
import type { ChangePasswordSchema } from "./ChangePassword.zod";

export type ChangePasswordFormType = zod.infer<typeof ChangePasswordSchema>;

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponseType {
  success: boolean;
  message: string;
  data: Data;
}
export interface Data {
  token: string;
  tokenType: string;
  expiresIn: string;
}
