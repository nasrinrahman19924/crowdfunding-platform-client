"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Button,
  Card,
  Input,
  Label,
  Select,
  ListBox,
  TextField,
} from "@heroui/react";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "supporter",
      photo: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // ========================================
      // STEP 1: Create Better Auth account
      // ========================================
      const { data: authData, error: authError } =
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
        });

      if (authError) {
        console.error("Registration failed:", authError);

        alert(authError.message || "Registration failed. Please try again.");

        return;
      }

      console.log("Better Auth registration successful:", authData);

      // ========================================
      // STEP 2: Create crowdfunding user profile
      // ========================================
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            role: data.role,
            photo: data.photo || "",
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Profile creation failed:", result);

        alert(
          result.message || "Account created, but profile creation failed.",
        );

        return;
      }

      console.log("Crowdfunding profile created:", result);

      alert("Registration successful! 🎉");

      // ========================================
      // STEP 3: Go to dashboard
      // ========================================
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        {/* ========================================
            HEADER
        ======================================== */}
        <Card.Header className="text-center">
          <Card.Title className="text-2xl font-bold">Create Account</Card.Title>

          <Card.Description>
            Join FundNest and start your crowdfunding journey.
          </Card.Description>
        </Card.Header>

        {/* ========================================
            FORM
        ======================================== */}
        <Card.Content>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Name */}
            <TextField isRequired>
              <Label>Name</Label>

              <Input
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                placeholder="Enter your name"
              />

              {errors.name && (
                <p className="text-sm text-danger">{errors.name.message}</p>
              )}
            </TextField>

            {/* Email */}
            <TextField isRequired>
              <Label>Email</Label>

              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="text-sm text-danger">{errors.email.message}</p>
              )}
            </TextField>

            {/* Password */}
            <TextField isRequired>
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter your password"
                  className="pr-12 w-full"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-500 hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-danger">{errors.password.message}</p>
              )}
            </TextField>

            {/* Role */}
            <TextField isRequired>
              <Label>Account Type</Label>

              <Select
                defaultSelectedKey="supporter"
                onSelectionChange={(value) => {
                  register("role").onChange({
                    target: {
                      name: "role",
                      value,
                    },
                  });
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="supporter" textValue="Supporter">
                      Supporter
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="creator" textValue="Creator">
                      Creator
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <input type="hidden" {...register("role")} />
            </TextField>

            {/* Photo */}
            <TextField>
              <Label>Profile Photo URL</Label>

              <Input
                type="url"
                {...register("photo")}
                placeholder="https://example.com/photo.jpg"
              />

              <p className="text-xs text-default-500">Optional</p>
            </TextField>

            {/* Submit */}
            <Button type="submit" className="w-full" isDisabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </Button>
          </form>
        </Card.Content>

        {/* ========================================
            LOGIN LINK
        ======================================== */}
        <Card.Footer className="justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </main>
  );
}
