"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@heroui/react";

const menuItems = {
  supporter: [
    { label: "Home", href: "/dashboard" },
    { label: "Explore Campaigns", href: "/dashboard/explore-campaigns" },
    { label: "My Contributions", href: "/dashboard/my-contributions" },
    { label: "Purchase Credit", href: "/dashboard/purchase-credit" },
    { label: "Payment History", href: "/dashboard/payment-history" },
  ],

  creator: [
    { label: "Home", href: "/dashboard" },
    { label: "Add New Campaign", href: "/dashboard/add-campaign" },
    { label: "My Campaigns", href: "/dashboard/my-campaigns" },
    { label: "Withdrawals", href: "/dashboard/withdrawals" },
    { label: "Payment History", href: "/dashboard/payment-history" },
  ],

  admin: [
    { label: "Home", href: "/dashboard" },
    {
      label: "Campaign Approvals",
      href: "/dashboard/admin/campaign-approvals",
    },
    { label: "Manage Users", href: "/dashboard/manage-users" },
    { label: "Manage Campaigns", href: "/dashboard/manage-campaigns" },
    { label: "Withdrawal Requests", href: "/dashboard/withdrawal-requests" },
    { label: "Reports", href: "/dashboard/reports" },
  ],
};

export default function DashboardSidebar({ profile, mobile = false, onClose }) {
  const pathname = usePathname();

  const role = profile?.role || "supporter";
  const items = menuItems[role] || [];

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-72 flex-col bg-background"
          : "hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col"
      }
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-xl font-bold" onClick={onClose}>
          FundNest
        </Link>
      </div>

      <Separator />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={profile?.photo || "https://i.pravatar.cc/100?img=12"}
            alt={profile?.name || "User"}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold">{profile?.name}</p>

            <p className="text-sm capitalize text-default-500">{role}</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border p-3">
          <p className="text-xs text-default-500">Available Credits</p>

          <p className="mt-1 text-lg font-bold">{profile?.credits ?? 0}</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? onClose : undefined}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-default-100 text-primary"
                    : "text-default-700 hover:bg-default-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <p className="text-xs text-default-500">Crowdfunding Platform</p>
      </div>
    </aside>
  );
}
