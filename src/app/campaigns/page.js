"use client";

import { useEffect, useState } from "react";

import CampaignCard from "@/components/dashboard/CampaignCard";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`,
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load campaigns");
          return;
        }

        setCampaigns(result.campaigns || []);
      } catch (error) {
        console.error("Load campaigns error:", error);
        setError("Something went wrong while loading campaigns.");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-default-500">Loading campaigns...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center">
            <h2 className="text-lg font-semibold">Failed to load campaigns</h2>

            <p className="mt-2 text-sm text-default-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Campaigns</h1>

          <p className="mt-2 text-sm text-default-500">
            Discover campaigns and support causes that matter to you.
          </p>
        </div>

        {/* Empty State */}
        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-xl font-semibold">No campaigns available</h2>

            <p className="mt-2 text-sm text-default-500">
              There are no active campaigns right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
