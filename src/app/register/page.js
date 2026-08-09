"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
    role: "supporter",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(formData);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <Card.Header className="text-center">
          <Card.Title className="text-2xl font-bold">
            Create Your Account
          </Card.Title>

          <Card.Description>Join our crowdfunding community</Card.Description>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <TextField isRequired>
              <Label>Name</Label>

              <Input
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </TextField>

            {/* Email */}
            <TextField isRequired>
              <Label>Email</Label>

              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </TextField>

            {/* Profile Picture */}
            <TextField>
              <Label>Profile Picture URL</Label>

              <Input
                type="url"
                name="photo"
                placeholder="https://example.com/photo.jpg"
                value={formData.photo}
                onChange={handleChange}
              />
            </TextField>

            {/* Password */}
            <TextField isRequired>
              <Label>Password</Label>

              <Input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </TextField>

            {/* Role */}
            <Select
              value={formData.role}
              onChange={(value) => {
                setFormData((previous) => ({
                  ...previous,
                  role: value,
                }));
              }}
              placeholder="Select your role"
              isRequired
            >
              <Label>I want to join as</Label>

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

            {/* Submit */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Card.Content>

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
