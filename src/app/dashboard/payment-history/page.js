"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function PaymentHistoryPage() {
  const router = useRouter();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPaymentHistory = async () => {
      try {
        // 1. Get logged-in user
        const { data, error: sessionError } = await authClient.getSession();

        if (sessionError || !data?.user) {
          router.replace("/login");
          return;
        }

        // 2. Get payment history
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/credits/payments?email=${encodeURIComponent(
            data.user.email,
          )}`,
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load payment history.");
          return;
        }

        setPayments(result.payments || []);
      } catch (error) {
        console.error("Payment history error:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentHistory();
  }, [router]);

  // Loading
  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-default-500">
            Loading payment history...
          </p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h1 className="text-xl font-semibold">
              Failed to Load Payment History
            </h1>

            <p className="mt-2 text-sm text-default-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Total purchased credits
  const totalPurchased = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-default-500">
            Supporter Wallet
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Payment History
          </h1>

          <p className="mt-2 text-sm text-default-500">
            View your credit purchase history.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-default-500">Total Purchases</p>

            <p className="mt-1 text-2xl font-bold">
              {payments.length}
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-default-500">Total Credits Purchased</p>

            <p className="mt-1 text-2xl font-bold">
              {totalPurchased.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {payments.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-lg font-semibold">
              No payment history yet
            </h2>

            <p className="mt-2 text-sm text-default-500">
              Your credit purchases will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="mt-6 hidden overflow-hidden rounded-xl border bg-background shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-default-50">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Date</th>
                      <th className="px-5 py-4 font-semibold">
                        Transaction
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Credits
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => {
                      const formattedDate = new Date(
                        payment.createdAt,
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      const formattedTime = new Date(
                        payment.createdAt,
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr
                          key={payment._id}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <div className="font-medium">
                              {formattedDate}
                            </div>

                            <div className="text-xs text-default-500">
                              {formattedTime}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium">
                              Credit Purchase
                            </p>

                            <p className="text-xs text-default-500">
                              {payment.email}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-semibold">
                              +{Number(payment.amount).toLocaleString()}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-success/10 px-3 py-1 text-xs font-medium capitalize text-success">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="mt-6 space-y-4 md:hidden">
              {payments.map((payment) => {
                const formattedDate = new Date(
                  payment.createdAt,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                const formattedTime = new Date(
                  payment.createdAt,
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <article
                    key={payment._id}
                    className="rounded-xl border bg-background p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          Credit Purchase
                        </p>

                        <p className="mt-1 text-xs text-default-500">
                          {formattedDate} · {formattedTime}
                        </p>
                      </div>

                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium capitalize text-success">
                        {payment.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-default-500">
                        Credits Purchased
                      </span>

                      <span className="font-bold text-success">
                        +{Number(payment.amount).toLocaleString()}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

