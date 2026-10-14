import {
  FieldError,
  Input,
  Label,
  TextField,
  ListBox,
  Select,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "iconsax-reactjs";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import { registerSchema } from "./register.zod";
import { sendUserDataRegister } from "./register.service";
import type { UserDataType } from "./register.interface";
import toast from "react-hot-toast";
import AppButton from "../../SharedComponent/AppButton/AppButton";

function RegisterForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserDataType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  const router = useNavigate();
  function handleRegister(data: UserDataType) {
    toast.promise(sendUserDataRegister(data), {
      loading: "Please Wait",
      success: function (data) {
        router("/login");
        return <h1 className="text-green-500 capitalize">{data.message}</h1>;
      },
      error: function (msgs) {
        return msgs.message;
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(handleRegister)}
      className="flex w-full flex-col gap-4 bg-white p-6 sm:p-10 my-10 rounded-4xl shadow-2xl"
    >
      {/* Name Input */}
      <TextField isRequired type="text" isInvalid={!!errors.name}>
        <Label>Name</Label>
        <Input
          {...register("name", {
            required: { value: true, message: "Name is Required" },
            pattern: {
              value: /([a-zA-Z0-9_\s]+)/,
              message: "Enter Valid Name",
            },
          })}
          className="focus:ring-main-color"
          placeholder="Write Your Name"
        />
        <FieldError />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name?.message}</span>
        )}
      </TextField>
      {/* Name Input */}

      {/* User Name Input */}
      <TextField isRequired type="text" isInvalid={!!errors.username}>
        <Label>User Name</Label>
        <Input
          {...register("username")}
          className="focus:ring-main-color"
          placeholder="Write Your User Name"
        />
        <FieldError />
        {errors.username && (
          <span className="text-red-500 text-xs">
            {errors.username?.message}
          </span>
        )}
      </TextField>
      {/* User Name Input */}

      {/* Email Input */}
      <TextField isRequired type="email" isInvalid={!!errors.email}>
        <Label>Email</Label>
        <Input
          {...register("email")}
          className="focus:ring-main-color"
          placeholder="Write Your Email"
        />
        <FieldError />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email?.message}</span>
        )}
      </TextField>
      {/* Email Input */}

      {/* Password Input */}
      <TextField isRequired type="password" isInvalid={!!errors.password}>
        <Label>Password</Label>
        <Input
          {...register("password")}
          className="focus:ring-main-color"
          placeholder="Enter your password"
        />
        <FieldError />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password?.message}
          </span>
        )}
      </TextField>
      {/* Password Input */}

      {/* Confirm Password Input */}
      <TextField isRequired type="password" isInvalid={!!errors.rePassword}>
        <Label>Confirm Password</Label>
        <Input
          {...register("rePassword")}
          className="focus:ring-main-color"
          placeholder="Enter your Confirm Password"
        />
        <FieldError />
        {errors.rePassword && (
          <span className="text-red-500 text-xs">
            {errors.rePassword?.message}
          </span>
        )}
      </TextField>
      {/* Confirm Password Input */}

      {/* Date Input */}
      <TextField isRequired type="date" isInvalid={!!errors.dateOfBirth}>
        <Label>Birth</Label>
        <Input
          {...register("dateOfBirth")}
          className="focus:ring-main-color"
          placeholder="Enter your Date Of Birth"
        />
        <FieldError />
        {errors.dateOfBirth && (
          <span className="text-red-500 text-xs">
            {errors.dateOfBirth?.message}
          </span>
        )}
      </TextField>
      {/* Date Input */}

      {/* Gender Input */}

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Select one"
            isInvalid={!!errors.gender}
          >
            <Label>Gender</Label>
            <Select.Trigger onBlur={field.onBlur}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="male" textValue="male">
                  Male
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="female" textValue="female">
                  Female
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
            {errors.gender && (
              <span className="text-red-500 text-sm">
                {errors.gender.message}
              </span>
            )}
          </Select>
        )}
      />
      {/* Gender Input */}

      <div className="flex gap-2 flex-col">
        <AppButton
          className="w-full bg-main-color hover:bg-main-color/80"
          isDisabled={isSubmitting}
          type="submit"
        >
          <Check />
          Sign Up
        </AppButton>
        <AppButton className="w-full" type="reset" variant="danger">
          Reset
        </AppButton>
      </div>
    </Form>
  );
}

export default RegisterForm;
