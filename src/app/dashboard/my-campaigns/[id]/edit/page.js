"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";

import { campaignSchema } from "@/schemas/campaignSchema";

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
    id: "environment",
    label: "Environment",
  },
  {
    id: "community",
    label: "Community",
  },
  {
    id: "technology",
    label: "Technology",
  },
];

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const selectedCategory = watch("category");

  // Load existing campaign
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${params.id}`,
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load campaign:", result);
          return;
        }

        const existingCampaign = result.campaign;

        setCampaign(existingCampaign);

        // Put existing data into form
        reset({
          title: existingCampaign.title || "",
          description: existingCampaign.description || "",
          image: existingCampaign.image || "",
          category: existingCampaign.category || "",
          goalAmount: existingCampaign.goalAmount || "",
          deadline: existingCampaign.deadline
            ? new Date(existingCampaign.deadline).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Load campaign error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCampaign();
    }
  }, [params.id, reset]);

  // Submit update
  const onSubmit = async (data) => {
    try {
      setUpdating(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            goalAmount: Number(data.goalAmount),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Campaign update failed:", result);
        return;
      }

      console.log("Campaign updated successfully:", result);

      router.push(`/dashboard/my-campaigns/${params.id}`);
    } catch (error) {
      console.error("Update campaign error:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-default-500">Loading campaign...</p>
        </div>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold">Campaign not found</h1>

          <Button
            className="mt-5"
            onPress={() => router.push("/dashboard/my-campaigns")}
          >
            Back to My Campaigns
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <Card>
          <Card.Header>
            <Card.Title className="text-2xl font-bold">
              Edit Campaign
            </Card.Title>

            <Card.Description>
              Update your campaign information.
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
                  placeholder="Enter campaign title"
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
                  placeholder="Describe your campaign"
                  rows={5}
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
                  placeholder="https://example.com/image.jpg"
                />

                {errors.image && (
                  <p className="text-sm text-danger">{errors.image.message}</p>
                )}
              </TextField>

              {/* Category */}
              <Select
                selectedKey={selectedCategory}
                onSelectionChange={(value) => {
                  setValue("category", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                <Label>Category</Label>

                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    {categories.map((category) => (
                      <ListBox.Item
                        key={category.id}
                        id={category.id}
                        textValue={category.label}
                      >
                        {category.label}

                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {errors.category && (
                <p className="text-sm text-danger">{errors.category.message}</p>
              )}

              {/* Goal Amount */}
              <TextField isRequired>
                <Label>Goal Amount</Label>

                <Input
                  type="number"
                  {...register("goalAmount", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter goal amount"
                />

                {errors.goalAmount && (
                  <p className="text-sm text-danger">
                    {errors.goalAmount.message}
                  </p>
                )}
              </TextField>

              {/* Deadline */}
              <TextField isRequired>
                <Label>Deadline</Label>

                <Input type="date" {...register("deadline")} />

                {errors.deadline && (
                  <p className="text-sm text-danger">
                    {errors.deadline.message}
                  </p>
                )}
              </TextField>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="flex-1" isDisabled={updating}>
                  {updating ? "Updating..." : "Update Campaign"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onPress={() =>
                    router.push(`/dashboard/my-campaigns/${params.id}`)
                  }
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
