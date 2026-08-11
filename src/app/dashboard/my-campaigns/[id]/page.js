"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

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

        setCampaign(result.campaign);
      } catch (error) {
        console.error("Load campaign error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCampaign();
    }
  }, [params.id]);

  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-default-500">Loading campaign...</p>
        </div>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold">Campaign not found</h1>

          <p className="mt-2 text-sm text-default-500">
            The campaign you are looking for does not exist.
          </p>

          <button
            onClick={() => router.push("/dashboard/my-campaigns")}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to My Campaigns
          </button>
        </div>
      </section>
    );
  }

  const goal = Number(campaign.goalAmount) || 0;
  const raised = Number(campaign.raisedAmount) || 0;

  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  const deadline = new Date(campaign.deadline).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
        return;
      }

      console.log("Campaign deleted successfully:", result);

      router.push("/dashboard/my-campaigns");
    } catch (error) {
      console.error("Delete campaign error:", error);
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/dashboard/my-campaigns"
          className="mb-6 inline-flex text-sm font-medium text-default-500 hover:text-foreground"
        >
          ← Back to My Campaigns
        </Link>

        {/* Main Card */}
        <article className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          {/* Image */}
          <div className="aspect-video w-full overflow-hidden bg-default-100">
            {campaign.image ? (
              <img
                src={campaign.image}
                alt={campaign.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-default-500">
                No image available
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 md:p-8">
            {/* Category + Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-default-100 px-3 py-1.5 text-xs font-semibold capitalize">
                {campaign.category}
              </span>

              <span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold capitalize text-success">
                {campaign.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-2xl font-bold md:text-4xl">
              {campaign.title}
            </h1>

            {/* Description */}
            <p className="mt-4 leading-7 text-default-500">
              {campaign.description}
            </p>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Funding Progress</span>

                <span className="text-sm font-bold">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-default-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-sm text-default-500">Raised</p>

                <p className="mt-1 text-xl font-bold">
                  ৳{raised.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-sm text-default-500">Goal</p>

                <p className="mt-1 text-xl font-bold">
                  ৳{goal.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-sm text-default-500">Deadline</p>

                <p className="mt-1 text-xl font-bold">{deadline}</p>
              </div>
            </div>

            {/* Creator */}
            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-default-500">Created by</p>

              <p className="mt-1 font-semibold">{campaign.creatorName}</p>

              <p className="text-sm text-default-500">
                {campaign.creatorEmail}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/my-campaigns/${campaign._id}/edit`}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Edit Campaign
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-danger px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
              >
                Delete Campaign
              </button>

              <Link
                href="/dashboard/my-campaigns"
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-default-100"
              >
                Back to Campaigns
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
