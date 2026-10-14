import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Check } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { LoginSchema } from "./Login.zod";
import type { UserLoginDataType } from "./Login.interface";
import { sendUserDataLogin } from "./Login.services";
import AppButton from "../../SharedComponent/AppButton/AppButton";
import { useContext } from "react";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";

function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(LoginSchema),
  });

  const router = useNavigate();
  const { setUserData } = useContext(userAuthContext);

  function sendUserData(data: UserLoginDataType) {
    toast.promise(sendUserDataLogin(data), {
      loading: "Please Wait",
      success: function (data) {
        localStorage.setItem("user_tkn", data.data.token);

        setUserData(data.data.user);

        router("/");
        return <h1 className="text-emerald-500 capitalize">{data.message}</h1>;
      },
      error: (data) => (
        <h1 className="text-red-500 capitalize">{data.message}</h1>
      ),
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(sendUserData)}
      className="flex w-full mx-auto flex-col gap-4 bg-white/60 p-6 sm:p-10 rounded-4xl shadow-2xl mb-20"
    >
      {/* email Input */}
      <TextField isRequired type="email" isInvalid={!!errors.email}>
        <Label>Email</Label>
        <Input
          {...register("email")}
          className="focus:ring-main-color"
          placeholder="Write Your Email"
        />
        <FieldError />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email?.message} </span>
        )}
      </TextField>
      {/* email Input */}

      {/* Password */}
      <TextField isRequired type="password" isInvalid={!!errors.password}>
        <Label>Password</Label>
        <Input
          {...register("password")}
          className="focus:ring-main-color"
          placeholder="Write Your Password"
        />
        <FieldError />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password?.message}{" "}
          </span>
        )}
      </TextField>

      <div className="flex flex-col gap-2">
        <AppButton className="w-full" type="submit" isDisabled={isSubmitting}>
          <Check />
          Login
        </AppButton>
        <AppButton className="w-full" type="reset" variant="danger-soft">
          Reset
        </AppButton>
      </div>
    </Form>
  );
}

export default LoginForm;
