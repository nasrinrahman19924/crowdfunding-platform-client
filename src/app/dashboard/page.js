"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useDashboard } from "./context/DashboardContext";
import { authClient } from "@/lib/auth-client";

export default function DashboardHomePage() {
  const { profile } = useDashboard();

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const isSupporter = profile?.role === "supporter";
  const isCreator = profile?.role === "creator";
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const loadDashboardSummary = async () => {
      if (!profile?.email) {
        setSummaryLoading(false);
        return;
      }

      try {
        setSummaryLoading(true);

        let apiUrl;

        // Admin has a separate summary endpoint
        if (isAdmin) {
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin-summary`;
        } else {
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/summary?email=${encodeURIComponent(
            profile.email,
          )}`;
        }

        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          console.error("Failed to get JWT token:", tokenError);
          return;
        }

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load dashboard summary:", result);
          return;
        }

        setSummary(result.summary);
      } catch (error) {
        console.error("Dashboard summary error:", error);
      } finally {
        setSummaryLoading(false);
      }
    };

    loadDashboardSummary();
  }, [profile?.email, isAdmin]);

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={async () => {
            const { data, error } = await authClient.token();

            console.log("JWT TOKEN:", data?.token);
            console.log("JWT ERROR:", error);
          }}
          className="mb-6 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Test JWT Token
        </button>

        {/* ========================================
            WELCOME
        ======================================== */}
        <div>
          <p className="text-sm font-medium text-default-500">Welcome back</p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            {profile?.name} 👋
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Here's an overview of your crowdfunding activities.
          </p>
        </div>

        {/* ========================================
            SUPPORTER STATS
        ======================================== */}
        {isSupporter && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Available Credits */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm font-medium text-default-500">
                Available Credits
              </p>

              <p className="mt-2 text-3xl font-bold">{profile?.credits ?? 0}</p>

              <p className="mt-1 text-xs text-default-500">
                Credits available in your account
              </p>
            </div>

            {/* Total Contributions */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm font-medium text-default-500">
                Total Contributions
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.totalContributions ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Total contributions made by you
              </p>
            </div>

            {/* Pending Contributions */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm font-medium text-default-500">
                Pending Contributions
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading
                  ? "..."
                  : (summary?.totalPendingContributions ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Contributions waiting for approval
              </p>
            </div>

            {/* Total Amount Contributed */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm font-medium text-default-500">
                Total Amount Contributed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading
                  ? "..."
                  : (summary?.totalAmountContributed ?? 0).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Approved contribution amount
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            CREATOR STATS
        ======================================== */}
        {isCreator && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Available Credits */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm text-default-500">Available Credits</p>

              <p className="mt-2 text-3xl font-bold">{profile?.credits ?? 0}</p>

              <p className="mt-1 text-xs text-default-500">
                Credits available in your account
              </p>
            </div>

            {/* My Campaigns */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm text-default-500">My Campaigns</p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.campaignCount ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Campaigns you have created
              </p>
            </div>

            {/* Total Raised */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm text-default-500">Total Raised</p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading
                  ? "..."
                  : (summary?.totalRaised ?? 0).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Total amount raised from your campaigns
              </p>
            </div>

            {/* Contributions */}
            <div className="rounded-xl border bg-background p-5">
              <p className="text-sm text-default-500">Contributions</p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.contributionCount ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Contributions received by your campaigns
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            ADMIN STATS
        ======================================== */}
        {isAdmin && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Supporters */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-default-500">
                Total Supporters
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.totalSupporters ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Registered supporter accounts
              </p>
            </div>

            {/* Total Creators */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-default-500">
                Total Creators
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.totalCreators ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Registered creator accounts
              </p>
            </div>

            {/* Total Available Credits */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-default-500">
                Total Available Credits
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading
                  ? "..."
                  : (summary?.totalAvailableCredits ?? 0).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Credits available across all users
              </p>
            </div>

            {/* Total Payments Processed */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <p className="text-sm font-medium text-default-500">
                Total Payments Processed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {summaryLoading
                  ? "..."
                  : (summary?.totalPaymentsProcessed ?? 0)}
              </p>

              <p className="mt-1 text-xs text-default-500">
                Completed credit purchases
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            SUPPORTER QUICK ACTIONS
        ======================================== */}
        {isSupporter && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Supporter Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/dashboard/explore-campaigns"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Explore Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  Discover active campaigns and support meaningful projects.
                </p>
              </Link>

              <Link
                href="/dashboard/my-contributions"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">My Contributions</h3>

                <p className="mt-2 text-sm text-default-500">
                  View your contributions and check their current status.
                </p>
              </Link>

              <Link
                href="/dashboard/purchase-credit"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Purchase Credits</h3>

                <p className="mt-2 text-sm text-default-500">
                  Buy more credits and continue supporting campaigns.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================
            CREATOR QUICK ACTIONS
        ======================================== */}
        {isCreator && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Creator Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/dashboard/add-campaign"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Create a Campaign</h3>

                <p className="mt-2 text-sm text-default-500">
                  Start a new crowdfunding campaign and reach your supporters.
                </p>
              </Link>

              <Link
                href="/dashboard/my-campaigns"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">My Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  View and manage all of your campaigns.
                </p>
              </Link>

              <Link
                href="/dashboard/withdrawals"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Withdrawals</h3>

                <p className="mt-2 text-sm text-default-500">
                  Request withdrawals and track your payment history.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================
            ADMIN QUICK ACTIONS
        ======================================== */}
        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Admin Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/dashboard/manage-users"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Manage Users</h3>

                <p className="mt-2 text-sm text-default-500">
                  Manage platform users and their accounts.
                </p>
              </Link>

              <Link
                href="/dashboard/manage-campaigns"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Manage Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  Review and manage crowdfunding campaigns.
                </p>
              </Link>

              <Link
                href="/dashboard/manage-contributions"
                className="rounded-xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Manage Contributions</h3>

                <p className="mt-2 text-sm text-default-500">
                  Review and manage supporter contributions.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================
            RECENT ACTIVITY
        ======================================== */}
        <div className="mt-8 rounded-xl border bg-background p-5">
          <h2 className="text-xl font-bold">Recent Activity</h2>

          <div className="mt-5 rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">No recent activity yet</p>

            <p className="mt-1 text-sm text-default-500">
              Your recent crowdfunding activities will appear here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
