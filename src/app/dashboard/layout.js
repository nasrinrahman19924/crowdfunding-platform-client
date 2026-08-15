"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardFooter from "./components/DashboardFooter";
import { DashboardProvider } from "./context/DashboardContext";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          router.replace("/login");
          return;
        }

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
        console.error("Dashboard layout error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <DashboardProvider profile={profile} setProfile={setProfile}>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <DashboardSidebar profile={profile} />

          {/* Main Area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Navbar */}
            <DashboardNavbar
              profile={profile}
              onMenuClick={() => setMobileMenuOpen(true)}
            />

            {/* Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <DashboardFooter />
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <button
              type="button"
              aria-label="Close dashboard menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative h-full w-72 shadow-xl">
              <DashboardSidebar
                profile={profile}
                mobile
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardProvider>
  );
}
