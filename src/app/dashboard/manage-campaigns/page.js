"use client";

import { useEffect, useState } from "react";

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadCampaigns = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/admin/all`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load campaigns");
      }

      setCampaigns(result.campaigns || []);
    } catch (error) {
      console.error("Load campaigns error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // ========================================
  // DELETE CAMPAIGN
  // ========================================
  const handleDelete = async (campaign) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${campaign.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(campaign._id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaign._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete campaign");
      }

      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((item) => item._id !== campaign._id),
      );

      alert("Campaign deleted successfully.");
    } catch (error) {
      console.error("Delete campaign error:", error);

      alert(error.message || "Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // STATUS BADGE
  // ========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-success-50 text-success";

      case "active":
        return "bg-primary-50 text-primary";

      case "rejected":
        return "bg-danger-50 text-danger";

      case "pending":
        return "bg-warning-50 text-warning";

      default:
        return "bg-default-100 text-default-600";
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* ========================================
            HEADER
        ======================================== */}
        <div>
          <p className="text-sm font-medium text-default-500">
            Admin Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Manage Campaigns
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Review and manage all crowdfunding campaigns on the platform.
          </p>
        </div>

        {/* ========================================
            SUMMARY CARDS
        ======================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Total Campaigns</p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : campaigns.length}
            </p>

            <p className="mt-1 text-xs text-default-500">All campaigns</p>
          </div>

          {/* Approved */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Approved</p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : campaigns.filter((campaign) => campaign.status === "approved")
                    .length}
            </p>

            <p className="mt-1 text-xs text-default-500">Approved campaigns</p>
          </div>

          {/* Active */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Active</p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : campaigns.filter((campaign) => campaign.status === "active")
                    .length}
            </p>

            <p className="mt-1 text-xs text-default-500">Currently active</p>
          </div>

          {/* Rejected */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Rejected</p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : campaigns.filter((campaign) => campaign.status === "rejected")
                    .length}
            </p>

            <p className="mt-1 text-xs text-default-500">Rejected campaigns</p>
          </div>
        </div>

        {/* ========================================
            CAMPAIGN TABLE
        ======================================== */}
        <div className="mt-6 overflow-hidden rounded-xl border bg-background">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-default-500">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No campaigns found</p>

              <p className="mt-1 text-sm text-default-500">
                Campaigns will appear here when creators submit them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b bg-default-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Campaign</th>

                    <th className="px-5 py-4 font-semibold">Creator</th>

                    <th className="px-5 py-4 font-semibold">Category</th>

                    <th className="px-5 py-4 font-semibold">Goal</th>

                    <th className="px-5 py-4 font-semibold">Raised</th>

                    <th className="px-5 py-4 font-semibold">Status</th>

                    <th className="px-5 py-4 font-semibold">Deadline</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map((campaign) => {
                    const isDeleting = deletingId === campaign._id;

                    return (
                      <tr
                        key={campaign._id}
                        className="border-b last:border-b-0"
                      >
                        {/* CAMPAIGN */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                campaign.image ||
                                "https://via.placeholder.com/80"
                              }
                              alt={campaign.title}
                              className="h-12 w-16 rounded-lg object-cover"
                            />

                            <div className="max-w-[250px]">
                              <p className="truncate font-semibold">
                                {campaign.title}
                              </p>

                              <p className="mt-1 truncate text-xs text-default-500">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CREATOR */}
                        <td className="px-5 py-4">
                          <p className="font-medium">{campaign.creatorName}</p>

                          <p className="mt-1 text-xs text-default-500">
                            {campaign.creatorEmail}
                          </p>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
                            {campaign.category}
                          </span>
                        </td>

                        {/* GOAL */}
                        <td className="px-5 py-4 font-semibold">
                          {Number(campaign.goalAmount || 0).toLocaleString()}
                        </td>

                        {/* RAISED */}
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {Number(
                              campaign.raisedAmount || 0,
                            ).toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-default-500">
                            {campaign.goalAmount
                              ? Math.min(
                                  Math.round(
                                    (campaign.raisedAmount /
                                      campaign.goalAmount) *
                                      100,
                                  ),
                                  100,
                                )
                              : 0}
                            % raised
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                              campaign.status,
                            )}`}
                          >
                            {campaign.status}
                          </span>
                        </td>

                        {/* DEADLINE */}
                        <td className="px-5 py-4">
                          {new Date(campaign.deadline).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(campaign)}
                            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
