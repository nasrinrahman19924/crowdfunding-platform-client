"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExploreCampaignsPage() {
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
          console.error(result);
          return;
        }

        setCampaigns(result.campaigns);
      } catch (error) {
        console.error("Campaign load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        Loading campaigns...
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Campaigns</h1>

          <p className="mt-2 text-default-500">
            Discover active crowdfunding campaigns and support meaningful
            projects.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-lg font-semibold">No active campaigns found</h2>

            <p className="mt-2 text-default-500">
              New campaigns will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={campaign.image || "https://placehold.co/600x400"}
                  alt={campaign.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {campaign.category}
                  </span>

                  <h2 className="mt-3 line-clamp-2 text-xl font-bold">
                    {campaign.title}
                  </h2>

                  <p className="mt-2 text-sm text-default-500">
                    by {campaign.creatorName}
                  </p>

                  <div className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-default-500">Funding Goal</span>

                      <span className="font-semibold">
                        {campaign.goalAmount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-default-500">Raised</span>

                      <span className="font-semibold text-success">
                        {campaign.raisedAmount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-default-500">Deadline</span>

                      <span className="font-semibold">
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/dashboard/contribute/${campaign._id}`}
                      className="flex-1 rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      Contribute
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
