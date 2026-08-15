"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useDashboard } from "../context/DashboardContext";
import { authClient } from "@/lib/auth-client";

export default function PurchaseCreditPage() {
  const router = useRouter();
  const { profile, setProfile } = useDashboard();

  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePurchase = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const creditAmount = Number(amount);

    if (!Number.isInteger(creditAmount) || creditAmount <= 0) {
      setError("Please enter a valid credit amount.");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error: sessionError } = await authClient.getSession();

      if (sessionError || !data?.user) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/credits/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.user.email,
            amount: creditAmount,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to purchase credits.");
        return;
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        credits: result.credits,
      }));

      setMessage(
        `Successfully purchased ${creditAmount} credits. Your new balance is ${result.credits} credits.`,
      );

      setAmount("");
    } catch (error) {
      console.error("Purchase credit error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-default-500">
            Supporter Wallet
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Purchase Credits
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Purchase credits to support crowdfunding campaigns.
          </p>
        </div>

        {/* Current Balance */}
        <div className="mt-6 rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-default-500">Available Credits</p>

          <p className="mt-1 text-3xl font-bold">{profile?.credits ?? 0}</p>
        </div>

        {/* Purchase Form */}
        <form
          onSubmit={handlePurchase}
          className="mt-6 rounded-xl border bg-background p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Buy Credits</h2>

          <p className="mt-1 text-sm text-default-500">
            Enter the number of credits you want to purchase.
          </p>

          {/* Amount */}
          <div className="mt-6">
            <label htmlFor="creditAmount" className="text-sm font-medium">
              Credit Amount
            </label>

            <input
              id="creditAmount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter credit amount"
              disabled={submitting}
              className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>

          {/* Quick Amounts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[50, 100, 250, 500].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                disabled={submitting}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-default-100 disabled:opacity-50"
              >
                {value} Credits
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mt-5 rounded-lg border border-success/30 bg-success/10 p-3">
              <p className="text-sm text-success">{message}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Purchasing..." : "Purchase Credits"}
          </button>

          <p className="mt-3 text-center text-xs text-default-500">
            Your credits will be added to your account after purchase.
          </p>
        </form>
      </div>
    </section>
  );
}
