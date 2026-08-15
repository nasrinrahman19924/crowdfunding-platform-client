"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CampaignCard({ campaign, isOwner = false }) {
  const router = useRouter();

  const progress =
    campaign.goalAmount > 0
      ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
      : 0;

  const formattedDeadline = new Date(campaign.deadline).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const detailsUrl = isOwner
    ? `/dashboard/my-campaigns/${campaign._id}`
    : `/campaigns/${campaign._id}`;

  const editUrl = `/dashboard/my-campaigns/${campaign._id}/edit`;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaign._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Delete campaign failed:", result);
        alert(result.message || "Failed to delete campaign.");
        return;
      }

      alert("Campaign deleted successfully.");

      router.push("/dashboard/my-campaigns");
      router.refresh();
    } catch (error) {
      console.error("Delete campaign error:", error);
      alert("Something went wrong while deleting the campaign.");
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-default-100">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-default-500">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category + Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
            {campaign.category}
          </span>

          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium capitalize text-success">
            {campaign.status}
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-4 line-clamp-2 text-lg font-semibold">
          {campaign.title}
        </h2>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm text-default-500">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs">
            <span>Raised</span>

            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-default-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-default-500">Goal</p>

            <p className="font-semibold">
              ৳{Number(campaign.goalAmount || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-default-500">Raised</p>

            <p className="font-semibold">
              ৳{Number(campaign.raisedAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-4">
          <p className="text-xs text-default-500">Deadline</p>

          <p className="text-sm font-medium">{formattedDeadline}</p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          {/* View Details */}
          <Link
            href={detailsUrl}
            className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium transition hover:bg-default-100"
          >
            View Details
          </Link>

          

          {/* Owner Actions */}
          {isOwner && (
            <>
              {/* Edit */}
              <Link
                href={editUrl}
                className="flex-1 rounded-lg bg-primary border px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Edit
              </Link>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg border border-danger px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
