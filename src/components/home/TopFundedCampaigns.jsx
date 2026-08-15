"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopFundedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load campaigns");
        }

        const sortedCampaigns = [...(result.campaigns || [])]
          .sort((a, b) => b.raisedAmount - a.raisedAmount)
          .slice(0, 6);

        setCampaigns(sortedCampaigns);
      } catch (error) {
        console.error("Top funded campaigns error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Top Funded Campaigns</h2>

          <p className="mt-3 text-sm text-default-500">Loading campaigns...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Community Support</p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Top Funded Campaigns
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-default-500 md:text-base">
            Discover the campaigns that have received the most support from our
            community.
          </p>
        </div>

        {/* Campaigns */}
        {campaigns.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed p-10 text-center">
            <p className="font-medium">No campaigns available yet.</p>

            <p className="mt-2 text-sm text-default-500">
              Check back later to discover new campaigns.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <article
                key={campaign._id}
                className="overflow-hidden rounded-2xl border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-default-100">
                  {campaign.image ? (
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-default-500">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
                    {campaign.category}
                  </span>

                  <h3 className="mt-4 line-clamp-2 text-lg font-bold">
                    {campaign.title}
                  </h3>

                  <div className="mt-4">
                    <p className="text-sm text-default-500">Total Raised</p>

                    <p className="mt-1 text-2xl font-bold text-primary">
                      ৳{Number(campaign.raisedAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/campaigns/${campaign._id}`}
                    className="mt-5 inline-flex border-2 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Explore */}
        <div className="mt-8 text-center">
          <Link
            href="/campaigns"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Explore All Campaigns →
          </Link>
        </div>
      </div>
    </section>
  );
}
