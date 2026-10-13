import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod.string().regex(/([a-zA-Z0-9_\s]+)/, "Invalid Name"),
    username: zod.string().regex(/^[a-zA-Z0-9_-]{3,16}$/, "Invalid User Name"),
    email: zod.string().email("Email not Correct"),
    password: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Invalid Password",
      ),
    rePassword: zod
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Invalid Password",
      ),
    dateOfBirth: zod
      .string()
      .min(1, "Date of birth is required")
      .refine(
        (value) => {
          const currentDate = new Date();
          const userDate = new Date(value);
          return currentDate.getFullYear() - userDate.getFullYear() > 21;
        },
        {
          message: "Your Age Must Be Above 21 Years Old",
        },
      ),
    gender: zod.enum(["male", "female"]),
  })
  .refine((value) => value.password === value.rePassword, {
    path: ["rePassword"],
    message: "Password should be same as rePassword",
  });
