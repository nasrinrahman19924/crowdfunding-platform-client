"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;
  const loading = isPending;

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          FundNest
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/campaigns"
            className="text-sm font-medium text-default-600 transition hover:text-foreground"
          >
            Explore Campaigns
          </Link>

          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-default-600 transition hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium text-default-600 transition hover:text-foreground"
              >
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-default-600 transition hover:text-foreground"
              >
                Dashboard
              </Link>

              <span className="rounded-lg border px-3 py-2 text-sm font-medium">
                Credits: {user.credits ?? 0}
              </span>

              <Link
                href="/dashboard/profile"
                className="text-sm font-medium text-default-600 transition hover:text-foreground"
              >
                {user.name || "Profile"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-default-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}

          {/* Join as Developer */}
          <a
            href="YOUR_CLIENT_GITHUB_REPOSITORY_URL"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join as Developer
          </a>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {!loading && user && (
            <Link
              href="/dashboard"
              className="rounded-lg border px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
