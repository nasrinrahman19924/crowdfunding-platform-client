"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function MyContributionsPage() {
  const router = useRouter();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      try {
        // 1. Get logged-in user
        const { data, error: sessionError } = await authClient.getSession();

        if (sessionError || !data?.user) {
          router.replace("/login");
          return;
        }

        // 2. Get donation history
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/my-donations?supporterEmail=${encodeURIComponent(
            data.user.email,
          )}`,
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load contributions");
          return;
        }

        setDonations(result.donations || []);
      } catch (error) {
        console.error("Load donations error:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, [router]);

  // Loading
  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-default-500">Loading contributions...</p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h1 className="text-xl font-semibold">
              Failed to Load Contributions
            </h1>

            <p className="mt-2 text-sm text-default-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Total contribution
  const totalContributions = donations.reduce(
    (total, donation) => total + Number(donation.amount),
    0,
  );

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Contributions</h1>

          <p className="mt-2 text-sm text-default-500">
            View the campaigns you have supported.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-default-500">Total Contributions</p>

          <p className="mt-1 text-2xl font-bold">
            ৳{totalContributions.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-default-500">
            {donations.length} contribution
            {donations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty State */}
        {donations.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-lg font-semibold">No contributions yet</h2>

            <p className="mt-2 text-sm text-default-500">
              Support a campaign to see your contributions here.
            </p>

            <Link
              href="/campaigns"
              className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
            >
              Browse Campaigns
            </Link>
          </div>
        ) : (
          /* Donation List */
          <div className="mt-6 space-y-5">
            {donations.map((donation) => {
              const formattedDate = new Date(
                donation.createdAt,
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <article
                  key={donation._id}
                  className="overflow-hidden rounded-xl border bg-background shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Campaign Image */}
                    <div className="h-48 w-full shrink-0 bg-default-100 sm:h-auto sm:w-56">
                      {donation.campaign?.image ? (
                        <img
                          src={donation.campaign.image}
                          alt={donation.campaign.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-default-500">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        {/* Category */}
                        {donation.campaign?.category && (
                          <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
                            {donation.campaign.category}
                          </span>
                        )}

                        {/* Title */}
                        <h2 className="mt-3 text-xl font-semibold">
                          {donation.campaign?.title || "Campaign unavailable"}
                        </h2>

                        {/* Date */}
                        <p className="mt-2 text-sm text-default-500">
                          Supported on {formattedDate}
                        </p>
                      </div>

                      {/* Bottom */}
                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs text-default-500">
                            Contribution
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            ৳{Number(donation.amount).toLocaleString()}
                          </p>
                        </div>

                        {donation.campaign?._id && (
                          <Link
                            href={`/campaigns/${donation.campaign._id}`}
                            className="rounded-lg border px-4 py-2 text-center text-sm font-medium transition hover:bg-default-100"
                          >
                            View Campaign
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
