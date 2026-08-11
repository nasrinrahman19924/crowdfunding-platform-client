"use client";

import Link from "next/link";

import { useDashboard } from "./context/DashboardContext";

export default function DashboardHomePage() {
  const { profile } = useDashboard();

  const isCreator = profile?.role === "creator";
  const isSupporter = profile?.role === "supporter";
  const isAdmin = profile?.role === "admin";

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Welcome */}
        <div>
          <p className="text-sm font-medium text-default-500">Welcome back</p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            {profile?.name} 👋
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Here's what's happening with your crowdfunding activities.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Credits */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Available Credits</p>

            <p className="mt-2 text-3xl font-bold">{profile?.credits ?? 0}</p>

            <p className="mt-1 text-xs text-default-500">
              Credits available in your account
            </p>
          </div>

          {/* Role */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Account Type</p>

            <p className="mt-2 text-2xl font-bold capitalize">
              {profile?.role}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Your current platform role
            </p>
          </div>

          {/* Activity */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Account Status</p>

            <p className="mt-2 text-2xl font-bold">Active</p>

            <p className="mt-1 text-xs text-default-500">
              Your account is ready to use
            </p>
          </div>
        </div>

        {/* Creator */}
        {isCreator && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Creator Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                href="/dashboard/add-campaign"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Create a Campaign</h3>

                <p className="mt-2 text-sm text-default-500">
                  Start a new crowdfunding campaign and reach your supporters.
                </p>
              </Link>

              <Link
                href="/dashboard/my-campaigns"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">My Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  View and manage all of your campaigns.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Supporter */}
        {isSupporter && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Supporter Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                href="/dashboard/explore-campaigns"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Explore Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  Discover campaigns and support meaningful projects.
                </p>
              </Link>

              <Link
                href="/dashboard/my-contributions"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">My Contributions</h3>

                <p className="mt-2 text-sm text-default-500">
                  View the campaigns you have supported.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Admin */}
        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Admin Quick Actions</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                href="/dashboard/manage-users"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Manage Users</h3>

                <p className="mt-2 text-sm text-default-500">
                  Manage platform users and their accounts.
                </p>
              </Link>

              <Link
                href="/dashboard/manage-campaigns"
                className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">Manage Campaigns</h3>

                <p className="mt-2 text-sm text-default-500">
                  Review and manage crowdfunding campaigns.
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8 rounded-xl border p-5">
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
