"use client";

import Link from "next/link";

import { Button, Separator } from "@heroui/react";

export default function DashboardNavbar({ profile, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <Button
            isIconOnly
            variant="light"
            className="md:hidden"
            onPress={onMenuClick}
            aria-label="Open dashboard menu"
          >
            ☰
          </Button>

          <div>
            <p className="text-lg font-semibold">Dashboard</p>

            <p className="hidden text-xs text-default-500 sm:block">
              Manage your crowdfunding activities
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Credits */}
          <div className="hidden rounded-lg border px-3 py-2 sm:block">
            <p className="text-xs text-default-500">Credits</p>

            <p className="font-bold">{profile?.credits ?? 0}</p>
          </div>

          <Separator orientation="vertical" className="hidden h-8 sm:block" />

          {/* User */}
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <img
              src={profile?.photo || "https://i.pravatar.cc/100?img=12"}
              alt={profile?.name || "User"}
              className="h-9 w-9 rounded-full object-cover"
            />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{profile?.name}</p>

              <p className="text-xs capitalize text-default-500">
                {profile?.role}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
