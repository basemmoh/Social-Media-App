import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Check } from "iconsax-reactjs";
import toast from "react-hot-toast";
import AppButton from "../../SharedComponent/AppButton/AppButton";
import { ChangePasswordSchema } from "./ChangePassword.zod";
import { changePassword } from "./ChangePassword.services";
import type { ChangePasswordFormType } from "./ChangePassword.interface";

function ChangePasswordForm() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormType>({
    defaultValues: { password: "", newPassword: "", rePassword: "" },
    mode: "all",
    resolver: zodResolver(ChangePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordFormType) {
    try {
      await toast.promise(
        changePassword({
          password: data.password,
          newPassword: data.newPassword,
        }),
        {
          loading: "Please Wait",
          success: (res) => {
            if (res.data?.token) {
              localStorage.setItem("user_tkn", res.data.token);
              message: "Password changed successfully";
            }
            reset();
            return res.message;
          },
          error: (err) => err.message,
        },
      );
    } catch {}
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md mx-auto flex-col gap-4 bg-white/60 p-8 rounded-4xl shadow-2xl"
    >
      <TextField isRequired type="password" isInvalid={!!errors.password}>
        <Label>Current Password</Label>
        <Input
          {...register("password")}
          className="focus:ring-main-color"
          placeholder="Enter your current password"
        />
        <FieldError>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </FieldError>
      </TextField>

      <TextField isRequired type="password" isInvalid={!!errors.newPassword}>
        <Label>New Password</Label>
        <Input
          {...register("newPassword")}
          className="focus:ring-main-color"
          placeholder="Enter your new password"
        />
        <FieldError>
          {errors.newPassword && (
            <span className="text-red-500 text-xs">
              {errors.newPassword.message}
            </span>
          )}
        </FieldError>
      </TextField>

      <TextField isRequired type="password" isInvalid={!!errors.rePassword}>
        <Label>Confirm New Password</Label>
        <Input
          {...register("rePassword")}
          className="focus:ring-main-color"
          placeholder="Confirm your new password"
        />
        <FieldError>
          {errors.rePassword && (
            <span className="text-red-500 text-xs">
              {errors.rePassword.message}
            </span>
          )}
        </FieldError>
      </TextField>

      <AppButton className="w-full" type="submit" isDisabled={isSubmitting}>
        <Check />
        Change Password
      </AppButton>
    </Form>
  );
}

export default ChangePasswordForm;
