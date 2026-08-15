"use client";

import { useEffect, useState } from "react";

export default function CampaignApprovalsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPendingCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/admin/pending`,
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to load pending campaigns.");
        return;
      }

      setCampaigns(result.campaigns || []);
    } catch (error) {
      console.error("Load pending campaigns error:", error);
      setError("Something went wrong while loading campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingCampaigns();
  }, []);

  const handleCampaignAction = async (campaignId, action) => {
    try {
      setActionLoading(campaignId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/admin/${campaignId}/${action}`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || `Failed to ${action} campaign.`);
        return;
      }

      setMessage(
        action === "approve"
          ? "Campaign approved successfully."
          : "Campaign rejected successfully.",
      );

      // Remove the reviewed campaign from pending list
      setCampaigns((currentCampaigns) =>
        currentCampaigns.filter((campaign) => campaign._id !== campaignId),
      );
    } catch (error) {
      console.error(`Campaign ${action} error:`, error);
      setError("Something went wrong. Please try again.");
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-default-500">
            Loading pending campaigns...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-default-500">Admin Panel</p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Campaign Approvals
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Review newly submitted campaigns before they become visible to
            supporters.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-4">
            <p className="text-sm font-medium text-success">{message}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-lg border border-danger/30 bg-danger/10 p-4">
            <p className="text-sm font-medium text-danger">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {campaigns.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-lg font-semibold">No Pending Campaigns</h2>

            <p className="mt-2 text-sm text-default-500">
              There are currently no campaigns waiting for approval.
            </p>
          </div>
        ) : (
          /* Campaign Table */
          <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b bg-default-50">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">
                      Campaign
                    </th>

                    <th className="px-5 py-4 text-left font-semibold">
                      Creator
                    </th>

                    <th className="px-5 py-4 text-left font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left font-semibold">Goal</th>

                    <th className="px-5 py-4 text-left font-semibold">
                      Deadline
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {campaigns.map((campaign) => {
                    const isProcessing = actionLoading === campaign._id;

                    return (
                      <tr
                        key={campaign._id}
                        className="transition hover:bg-default-50"
                      >
                        {/* Campaign */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-default-100">
                              {campaign.image ? (
                                <img
                                  src={campaign.image}
                                  alt={campaign.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-default-500">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="max-w-xs">
                              <p className="font-semibold">{campaign.title}</p>

                              <p className="mt-1 truncate text-xs text-default-500">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Creator */}
                        <td className="px-5 py-4">
                          <p className="font-medium">{campaign.creatorName}</p>

                          <p className="mt-1 text-xs text-default-500">
                            {campaign.creatorEmail}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
                            {campaign.category}
                          </span>
                        </td>

                        {/* Goal */}
                        <td className="px-5 py-4 font-semibold">
                          ৳{Number(campaign.goalAmount).toLocaleString()}
                        </td>

                        {/* Deadline */}
                        <td className="px-5 py-4 text-default-500">
                          {formatDate(campaign.deadline)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleCampaignAction(campaign._id, "approve")
                              }
                              className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleCampaignAction(campaign._id, "reject")
                              }
                              className="rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
