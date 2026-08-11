"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, Input, Label, TextArea, TextField } from "@heroui/react";

import { campaignSchema } from "@/schemas/campaignSchema";
import { authClient } from "@/lib/auth-client";

const categories = [
  {
    id: "education",
    label: "Education",
  },
  {
    id: "medical",
    label: "Medical",
  },
  {
    id: "emergency",
    label: "Emergency",
  },
  {
    id: "community",
    label: "Community",
  },
  {
    id: "other",
    label: "Other",
  },
];

export default function AddCampaignPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campaignSchema),

    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "",
      goalAmount: "",
      deadline: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // 1. Get logged-in user
      const { data: sessionData, error: sessionError } =
        await authClient.getSession();

      if (sessionError || !sessionData?.user) {
        console.error("Session error:", sessionError);
        return;
      }

      const user = sessionData.user;

      // 2. Prepare campaign data
      const campaignData = {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        goalAmount: data.goalAmount,
        deadline: data.deadline,

        // Comes from BetterAuth session
        creatorEmail: user.email,
        creatorName: user.name,
      };

      console.log("Sending campaign:", campaignData);

      // 3. Send to Express API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaignData),
        },
      );

      const result = await response.json();

      // 4. Handle API error
      if (!response.ok) {
        console.error("Campaign creation failed:", result);
        return;
      }

      // 5. Success
      console.log("Campaign created successfully:", result);
    } catch (error) {
      console.error("Create campaign error:", error);
    }
  };
  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-default-500 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-3 text-2xl font-bold md:text-3xl">
            Create New Campaign
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Tell people about your campaign and what you want to achieve.
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <Card.Header>
            <Card.Title>Campaign Information</Card.Title>

            <Card.Description>
              Fill in the details below to create your campaign.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Title */}
              <TextField isRequired>
                <Label>Campaign Title</Label>

                <Input
                  {...register("title")}
                  placeholder="e.g. Help Build a Community Library"
                />

                {errors.title && (
                  <p className="text-sm text-danger">{errors.title.message}</p>
                )}
              </TextField>

              {/* Description */}
              <TextField isRequired>
                <Label>Description</Label>

                <TextArea
                  {...register("description")}
                  placeholder="Tell people about your campaign..."
                  rows={6}
                />

                {errors.description && (
                  <p className="text-sm text-danger">
                    {errors.description.message}
                  </p>
                )}
              </TextField>

              {/* Image */}
              <TextField>
                <Label>Campaign Image URL</Label>

                <Input
                  type="url"
                  {...register("image")}
                  placeholder="https://example.com/campaign-image.jpg"
                />

                {errors.image && (
                  <p className="text-sm text-danger">{errors.image.message}</p>
                )}
              </TextField>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>

                <select
                  id="category"
                  {...register("category")}
                  className="h-10 w-full rounded-lg border border-default-200 bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="text-sm text-danger">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {errors.category && (
                <p className="text-sm text-danger">{errors.category.message}</p>
              )}

              {/* Goal Amount */}
              <TextField isRequired>
                <Label>Goal Amount (BDT)</Label>

                <Input
                  type="number"
                  min="1"
                  {...register("goalAmount")}
                  placeholder="e.g. 100000"
                />

                {errors.goalAmount && (
                  <p className="text-sm text-danger">
                    {errors.goalAmount.message}
                  </p>
                )}
              </TextField>

              {/* Deadline */}
              <TextField isRequired>
                <Label>Campaign Deadline</Label>

                <Input type="date" {...register("deadline")} />

                {errors.deadline && (
                  <p className="text-sm text-danger">
                    {errors.deadline.message}
                  </p>
                )}
              </TextField>

              {/* Submit */}
              <Button type="submit" className="w-full">
                Create Campaign
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
