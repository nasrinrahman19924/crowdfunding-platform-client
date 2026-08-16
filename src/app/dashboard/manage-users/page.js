"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "../context/DashboardContext";

export default function ManageUsersPage() {
  const { profile } = useDashboard();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/all`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load users");
      }

      setUsers(result.users || []);
    } catch (error) {
      console.error("Load users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================================
  // UPDATE ROLE
  // ================================
  const handleRoleChange = async (userId, newRole) => {
    try {
      setProcessingId(userId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update role");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user,
        ),
      );
    } catch (error) {
      console.error("Update role error:", error);

      alert(error.message || "Failed to update user role");
    } finally {
      setProcessingId(null);
    }
  };

  // ================================
  // DELETE USER
  // ================================
  const handleDelete = async (user) => {
    // Prevent admin from deleting himself
    if (user.email === profile?.email) {
      alert("You cannot remove your own admin account.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(user._id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/${user._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((item) => item._id !== user._id),
      );

      alert("User removed successfully.");
    } catch (error) {
      console.error("Delete user error:", error);

      alert(error.message || "Failed to remove user");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* ================================
            HEADER
        ================================= */}
        <div>
          <p className="text-sm font-medium text-default-500">
            Admin Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Manage Users</h1>

          <p className="mt-2 text-sm text-default-500">
            Manage platform users, roles, and account access.
          </p>
        </div>

        {/* ================================
            SUMMARY
        ================================= */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Total Users</p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : users.length}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Registered platform users
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Creators</p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : users.filter((user) => user.role === "creator").length}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Users creating campaigns
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Supporters</p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : users.filter((user) => user.role === "supporter").length}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Users supporting campaigns
            </p>
          </div>
        </div>

        {/* ================================
            USERS TABLE
        ================================= */}
        <div className="mt-6 overflow-hidden rounded-xl border bg-background">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-default-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No users found</p>

              <p className="mt-1 text-sm text-default-500">
                Registered users will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b bg-default-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>

                    <th className="px-5 py-4 font-semibold">Email</th>

                    <th className="px-5 py-4 font-semibold">Role</th>

                    <th className="px-5 py-4 font-semibold">Credits</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isCurrentUser = user.email === profile?.email;

                    const isProcessing = processingId === user._id;

                    return (
                      <tr key={user._id} className="border-b last:border-b-0">
                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                user.photo || "https://i.pravatar.cc/100?img=12"
                              }
                              alt={user.name || "User"}
                              className="h-10 w-10 rounded-full object-cover"
                            />

                            <div>
                              <p className="font-semibold">{user.name}</p>

                              {isCurrentUser && (
                                <span className="text-xs text-primary">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-5 py-4">
                          <span className="text-default-600">{user.email}</span>
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4">
                          <select
                            value={user.role}
                            disabled={isProcessing || isCurrentUser}
                            onChange={(event) =>
                              handleRoleChange(user._id, event.target.value)
                            }
                            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="admin">Admin</option>

                            <option value="creator">Creator</option>

                            <option value="supporter">Supporter</option>
                          </select>
                        </td>

                        {/* CREDITS */}
                        <td className="px-5 py-4">
                          <span className="font-semibold">
                            {Number(user.credits || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={isProcessing || isCurrentUser}
                            onClick={() => handleDelete(user)}
                            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isProcessing ? "Processing..." : "Remove"}
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
