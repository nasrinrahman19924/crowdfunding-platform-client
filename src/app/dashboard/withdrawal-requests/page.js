"use client";

import { useEffect, useState } from "react";

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/pending`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load withdrawal requests");
      }

      setWithdrawals(result.withdrawals || []);
    } catch (error) {
      console.error("Load withdrawals error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this withdrawal as paid?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to approve withdrawal");
      }

      alert("Payment marked as successful.");

      // Remove approved request from pending list
      setWithdrawals((prev) =>
        prev.filter((withdrawal) => withdrawal._id !== id),
      );
    } catch (error) {
      console.error("Approve withdrawal error:", error);

      alert(error.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-default-500">
            Admin Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Withdrawal Requests
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Review pending withdrawal requests and confirm successful payments.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-xl border bg-background p-5">
          <p className="text-sm text-default-500">
            Pending Withdrawal Requests
          </p>

          <p className="mt-1 text-3xl font-bold">
            {loading ? "..." : withdrawals.length}
          </p>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border bg-background">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-default-500">
                Loading withdrawal requests...
              </p>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No pending withdrawal requests</p>

              <p className="mt-1 text-sm text-default-500">
                New withdrawal requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-default-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Creator</th>

                    <th className="px-5 py-4 font-semibold">
                      Withdrawal Credits
                    </th>

                    <th className="px-5 py-4 font-semibold">Amount</th>

                    <th className="px-5 py-4 font-semibold">Payment System</th>

                    <th className="px-5 py-4 font-semibold">Account Number</th>

                    <th className="px-5 py-4 font-semibold">Request Date</th>

                    <th className="px-5 py-4 font-semibold">Status</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal._id}
                      className="border-b last:border-b-0"
                    >
                      {/* Creator */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold">
                            {withdrawal.creator_name}
                          </p>

                          <p className="mt-1 text-xs text-default-500">
                            {withdrawal.creator_email}
                          </p>
                        </div>
                      </td>

                      {/* Credits */}
                      <td className="px-5 py-4 font-semibold">
                        {withdrawal.withdrawal_credit}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold">
                        $
                        {Number(
                          withdrawal.withdrawal_amount || 0,
                        ).toLocaleString()}
                      </td>

                      {/* Payment System */}
                      <td className="px-5 py-4">
                        <span className="capitalize">
                          {withdrawal.payment_system}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="px-5 py-4">{withdrawal.account_number}</td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        {new Date(
                          withdrawal.withdraw_date,
                        ).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-warning-100 px-3 py-1 text-xs font-semibold text-warning-700">
                          Pending
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleApprove(withdrawal._id)}
                          disabled={processingId === withdrawal._id}
                          className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processingId === withdrawal._id
                            ? "Processing..."
                            : "Payment Success"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
