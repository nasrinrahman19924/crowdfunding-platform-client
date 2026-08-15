"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params?.campaignId;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;

    const loadCampaign = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignId}`,
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load campaign:", result);
          return;
        }

        setCampaign(result.campaign);
      } catch (error) {
        console.error("Campaign details error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-default-500">Loading campaign...</p>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl border p-8 text-center">
          <h1 className="text-xl font-bold">Campaign not found</h1>

          <p className="mt-2 text-default-500">
            This campaign may have been removed or is no longer available.
          </p>

          <Link
            href="/dashboard/explore-campaigns"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-white"
          >
            Back to Campaigns
          </Link>
        </div>
      </section>
    );
  }

  const goalAmount = Number(campaign.goalAmount || 0);
  const raisedAmount = Number(campaign.raisedAmount || 0);

  const progress =
    goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/dashboard/explore-campaigns"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Campaigns
        </Link>

        {/* Campaign */}
        <div className="mt-5 overflow-hidden rounded-2xl border bg-background">
          {/* Image */}
          <img
            src={campaign.image || "https://placehold.co/1200x600"}
            alt={campaign.title}
            className="h-64 w-full object-cover md:h-96"
          />

          <div className="p-5 md:p-8">
            {/* Category */}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
              {campaign.category}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              {campaign.title}
            </h1>

            {/* Creator */}
            <p className="mt-3 text-sm text-default-500">
              Created by{" "}
              <span className="font-medium text-foreground">
                {campaign.creatorName}
              </span>
            </p>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold">About this campaign</h2>

              <p className="mt-3 leading-7 text-default-600">
                {campaign.description}
              </p>
            </div>

            {/* Funding Info */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-default-500">Goal</p>

                <p className="mt-1 text-2xl font-bold">
                  ৳{goalAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-default-500">Raised</p>

                <p className="mt-1 text-2xl font-bold">
                  ৳{raisedAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-default-500">Deadline</p>

                <p className="mt-1 text-lg font-bold">
                  {new Date(campaign.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">Funding Progress</span>

                <span className="text-default-500">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-default-100">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Support */}
            <div className="mt-8 rounded-xl border bg-default-50 p-5">
              <h2 className="text-xl font-bold">Support This Campaign</h2>

              <p className="mt-2 text-sm text-default-500">
                Ready to support this campaign? Choose your contribution amount.
              </p>

              <Link
                href={`/dashboard/explore-campaigns/${campaign._id}/contribute`}
                className="mt-5 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Support Campaign
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
