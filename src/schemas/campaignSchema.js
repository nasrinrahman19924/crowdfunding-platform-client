import { z } from "zod";

export const campaignSchema = z.object({
  title: z
    .string()
    .min(5, "Campaign title must be at least 5 characters")
    .max(100, "Campaign title must be less than 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters"),

  image: z.string().url("Please enter a valid image URL").or(z.literal("")),

  category: z.string().min(1, "Please select a category"),

  goalAmount: z.coerce.number().positive("Goal amount must be greater than 0"),

  deadline: z
    .string()
    .min(1, "Please select a deadline")
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
      {
        message: "Deadline cannot be in the past",
      },
    ),
});
