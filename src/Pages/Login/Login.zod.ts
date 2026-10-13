import * as zod from "zod";

export const LoginSchema = zod.object({
  email: zod.string().email("Email Not Correct"),
  password: zod
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "INvalidPassword",
    ),
});
