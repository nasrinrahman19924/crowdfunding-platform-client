"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    reviewedReports: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // ========================================
  // LOAD REPORTS
  // ========================================
  const loadReports = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load reports");
      }

      setReports(result.reports || []);
    } catch (error) {
      console.error("Load reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD REPORT STATS
  // ========================================
  const loadReportStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/stats`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load report stats");
      }

      setStats({
        totalReports: result.totalReports || 0,
        pendingReports: result.pendingReports || 0,
        reviewedReports: result.reviewedReports || 0,
      });
    } catch (error) {
      console.error("Load report stats error:", error);
    }
  };

  // ========================================
  // LOAD DATA
  // ========================================
  const loadData = async () => {
    await Promise.all([loadReports(), loadReportStats()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========================================
  // REVIEW REPORT
  // ========================================
  const handleReview = async (report) => {
    const confirmed = window.confirm(
      `Mark the report for "${report.campaignTitle}" as reviewed?`,
    );

    if (!confirmed) return;

    try {
      setActionId(report._id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${report._id}/review`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to review report");
      }

      setReports((prevReports) =>
        prevReports.map((item) =>
          item._id === report._id
            ? {
                ...item,
                status: "reviewed",
                action: "reviewed",
              }
            : item,
        ),
      );

      await loadReportStats();

      alert("Report marked as reviewed successfully.");
    } catch (error) {
      console.error("Review report error:", error);

      alert(error.message || "Failed to review report");
    } finally {
      setActionId(null);
    }
  };

  // ========================================
  // SUSPEND CAMPAIGN
  // ========================================
  const handleSuspend = async (report) => {
    const confirmed = window.confirm(
      `Are you sure you want to suspend "${report.campaignTitle}"?`,
    );

    if (!confirmed) return;

    try {
      setActionId(report._id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/campaign/${report.campaignId}/suspend`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to suspend campaign");
      }

      setReports((prevReports) =>
        prevReports.map((item) =>
          item.campaignId === report.campaignId
            ? {
                ...item,
                status: "reviewed",
                action: "suspended",
              }
            : item,
        ),
      );

      await loadReportStats();

      alert("Campaign suspended successfully.");
    } catch (error) {
      console.error("Suspend campaign error:", error);

      alert(error.message || "Failed to suspend campaign");
    } finally {
      setActionId(null);
    }
  };

  // ========================================
  // DELETE CAMPAIGN
  // ========================================
  const handleDelete = async (report) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${report.campaignTitle}"?`,
    );

    if (!confirmed) return;

    try {
      setActionId(report._id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/campaign/${report.campaignId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete campaign");
      }

      setReports((prevReports) =>
        prevReports.map((item) =>
          item.campaignId === report.campaignId
            ? {
                ...item,
                status: "reviewed",
                action: "deleted",
              }
            : item,
        ),
      );

      await loadReportStats();

      alert("Campaign deleted successfully.");
    } catch (error) {
      console.error("Delete campaign error:", error);

      alert(error.message || "Failed to delete campaign");
    } finally {
      setActionId(null);
    }
  };

  // ========================================
  // STATUS BADGE
  // ========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning-50 text-warning";

      case "reviewed":
        return "bg-success-50 text-success";

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

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">Reports</h1>

          <p className="mt-2 text-sm text-default-500">
            Review campaigns reported by supporters as suspicious or
            fraudulent.
          </p>
        </div>

        {/* ========================================
            SUMMARY
        ======================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Reports */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Total Reports</p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : stats.totalReports}
            </p>

            <p className="mt-1 text-xs text-default-500">
              All submitted reports
            </p>
          </div>

          {/* Pending Reports */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Pending Reports</p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : stats.pendingReports}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Waiting for admin review
            </p>
          </div>

          {/* Reviewed Reports */}
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm text-default-500">Reviewed Reports</p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : stats.reviewedReports}
            </p>

            <p className="mt-1 text-xs text-default-500">
              Already handled by admin
            </p>
          </div>
        </div>

        {/* ========================================
            REPORT TABLE
        ======================================== */}
        <div className="mt-6 overflow-hidden rounded-xl border bg-background">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-default-500">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No reports found</p>

              <p className="mt-1 text-sm text-default-500">
                Reported campaigns will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="border-b bg-default-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Reporter</th>

                    <th className="px-5 py-4 font-semibold">Campaign</th>

                    <th className="px-5 py-4 font-semibold">Reason</th>

                    <th className="px-5 py-4 font-semibold">Date</th>

                    <th className="px-5 py-4 font-semibold">Status</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report) => {
                    const isProcessing = actionId === report._id;

                    const isReviewed = report.status === "reviewed";

                    return (
                      <tr
                        key={report._id}
                        className="border-b last:border-b-0"
                      >
                        {/* REPORTER */}
                        <td className="px-5 py-4">
                          <p className="font-semibold">{report.reporterName}</p>

                          <p className="mt-1 text-xs text-default-500">
                            {report.reporterEmail}
                          </p>
                        </td>

                        {/* CAMPAIGN */}
                        <td className="px-5 py-4">
                          <p className="max-w-[250px] truncate font-semibold">
                            {report.campaignTitle}
                          </p>
                        </td>

                        {/* REASON */}
                        <td className="px-5 py-4">
                          <p className="max-w-[300px] text-sm">
                            {report.reason}
                          </p>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                              report.status,
                            )}`}
                          >
                            {report.status}
                          </span>

                          {report.action && (
                            <p className="mt-2 text-xs text-default-500 capitalize">
                              Action: {report.action}
                            </p>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* REVIEW */}
                            <button
                              type="button"
                              disabled={isProcessing || isReviewed}
                              onClick={() => handleReview(report)}
                              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isProcessing ? "Processing..." : "Review"}
                            </button>

                            {/* SUSPEND */}
                            <button
                              type="button"
                              disabled={isProcessing || isReviewed}
                              onClick={() => handleSuspend(report)}
                              className="rounded-lg bg-warning px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isProcessing ? "Processing..." : "Suspend"}
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              disabled={isProcessing || isReviewed}
                              onClick={() => handleDelete(report)}
                              className="rounded-lg bg-danger px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isProcessing ? "Processing..." : "Delete"}
                            </button>
                          </div>
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
