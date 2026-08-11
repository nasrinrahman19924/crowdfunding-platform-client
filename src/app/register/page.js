"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Step 1: Get Better Auth session
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          router.replace("/login");
          return;
        }

        setSession(data);

        // Step 2: Get crowdfunding profile from MongoDB
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?email=${encodeURIComponent(
            data.user.email,
          )}`,
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Profile fetch failed:", result);
          return;
        }

        setProfile(result.user);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (!session?.user || !profile) {
    return null;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Welcome, {profile.name} 👋</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="text-sm">Role</p>
            <p className="mt-2 text-xl font-semibold capitalize">
              {profile.role}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm">Available Credits</p>
            <p className="mt-2 text-xl font-semibold">{profile.credits}</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm">Email</p>
            <p className="mt-2 break-all font-semibold">{profile.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
