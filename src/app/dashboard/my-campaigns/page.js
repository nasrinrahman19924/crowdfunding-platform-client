"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import CampaignCard from "@/components/dashboard/CampaignCard";

export default function MyCampaignsPage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await authClient.getSession();

        if (sessionError || !sessionData?.user) {
          router.replace("/login");
          return;
        }

        const user = sessionData.user;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/creator?creatorEmail=${encodeURIComponent(
            user.email,
          )}`,
        );
        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load campaigns:", result);
          return;
        }

        setCampaigns(result.campaigns || []);
      } catch (error) {
        console.error("Load campaigns error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [router]);

  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-default-500">Loading campaigns...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">My Campaigns</h1>

          <p className="mt-2 text-sm text-default-500">
            Manage and track the campaigns you have created.
          </p>
        </div>

        {/* Campaigns */}
        {campaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <h2 className="text-xl font-semibold">No campaigns yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-default-500">
              You haven't created any campaigns yet. Start your first campaign
              and make an impact.
            </p>

            <button
              onClick={() => router.push("/dashboard/add-campaign")}
              className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
