"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, Input, Label, TextField } from "@heroui/react";

import { loginSchema } from "@/schemas/loginSchema";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { data: result, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Login failed:", error);
        return;
      }

      console.log("Login successful:", result);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <Card.Header className="text-center">
          <Card.Title className="text-2xl font-bold">Welcome Back</Card.Title>

          <Card.Description>
            Login to your crowdfunding account
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <TextField isRequired>
              <Label>Email</Label>

              <Input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="text-sm text-danger">{errors.email.message}</p>
              )}
            </TextField>

            {/* Password */}
            <TextField isRequired>
              <Label>Password</Label>

              <Input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
              />

              {errors.password && (
                <p className="text-sm text-danger">{errors.password.message}</p>
              )}
            </TextField>

            <Button type="submit" className="w-full" isDisabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="justify-center">
          <p className="text-sm">
            Do not have an account?{" "}
            <Link href="/register" className="font-semibold underline">
              Register
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </main>
  );
}
