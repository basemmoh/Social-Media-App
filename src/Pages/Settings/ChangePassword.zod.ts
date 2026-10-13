import * as zod from "zod";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const ChangePasswordSchema = zod
  .object({
    password: zod.string().regex(passwordRegex, "Invalid Password"),
    newPassword: zod
      .string()
      .regex(
        passwordRegex,
        "Must be 8+ characters with upper, lower case and a number",
      ),
    rePassword: zod.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.rePassword, {
    path: ["rePassword"],
    message: "Passwords don't match",
  })
  .refine((v) => v.newPassword !== v.password, {
    path: ["newPassword"],
    message: "New password must be different from the current one",
  });
