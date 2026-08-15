"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useDashboard } from "../../context/DashboardContext";
import { authClient } from "@/lib/auth-client";

export default function ContributePage() {
  const params = useParams();
  const router = useRouter();

  const { profile } = useDashboard();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const campaignId = params?.id;

  // ========================================
  // Load Campaign
  // ========================================
  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignId}`,
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load campaign");
          return;
        }

        setCampaign(result.campaign);
      } catch (error) {
        console.error("Load campaign error:", error);
        setError("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  // ========================================
  // Amount validation
  // ========================================
  const contributionAmount = Number(amount);

  const remainingCredits =
    Number(profile?.credits || 0) -
    (Number.isFinite(contributionAmount) ? contributionAmount : 0);

  const remainingCampaignAmount = campaign
    ? Number(campaign.goalAmount || 0) - Number(campaign.raisedAmount || 0)
    : 0;

  // ========================================
  // Submit Contribution
  // ========================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!profile?.email) {
      setError("Please login again.");
      return;
    }

    if (profile.role !== "supporter") {
      setError("Only supporters can contribute to campaigns.");
      return;
    }

    if (!amount || !Number.isFinite(contributionAmount)) {
      setError("Please enter a valid contribution amount.");
      return;
    }

    if (contributionAmount <= 0) {
      setError("Contribution amount must be greater than 0.");
      return;
    }

    if (contributionAmount > Number(profile.credits || 0)) {
      setError("You do not have enough credits.");
      return;
    }

    if (contributionAmount > remainingCampaignAmount) {
      setError(
        `Maximum contribution amount is ৳${remainingCampaignAmount.toLocaleString()}.`,
      );
      return;
    }

    try {
      setSubmitting(true);

      // Get Better Auth session
      const { data, error: sessionError } = await authClient.getSession();

      if (sessionError || !data?.user) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            contribution_amount: contributionAmount,
            supporter_email: data.user.email,
            supporter_name: data.user.name,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Contribution failed.");
        return;
      }

      alert("Contribution submitted successfully! It is waiting for approval.");

      router.push("/dashboard/my-contributions");
      router.refresh();
    } catch (error) {
      console.error("Contribution error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // Loading
  // ========================================
  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border bg-background p-8 text-center">
            <p>Loading campaign...</p>
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // Error / Campaign not found
  // ========================================
  if (!campaign) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border bg-background p-8 text-center">
            <p className="font-semibold">Campaign not found</p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // Main UI
  // ========================================
  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-default-500">
            Support Campaign
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Make a Contribution
          </h1>

          <p className="mt-2 text-sm text-default-500">
            Support this campaign using your available credits.
          </p>
        </div>

        {/* Campaign Card */}
        <div className="overflow-hidden rounded-xl border bg-background">
          {campaign.image && (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="h-56 w-full object-cover"
            />
          )}

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm capitalize text-default-500">
                  {campaign.category}
                </p>

                <h2 className="mt-1 text-xl font-bold">{campaign.title}</h2>
              </div>

              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                {campaign.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-default-600">
              {campaign.description}
            </p>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>
                  Raised: ৳{Number(campaign.raisedAmount || 0).toLocaleString()}
                </span>

                <span>
                  Goal: ৳{Number(campaign.goalAmount || 0).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-default-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      (Number(campaign.raisedAmount || 0) /
                        Number(campaign.goalAmount || 1)) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border bg-background p-5"
        >
          {/* Credits */}
          <div className="rounded-lg border bg-default-50 p-4">
            <p className="text-sm text-default-500">Available Credits</p>

            <p className="mt-1 text-2xl font-bold">
              ৳{Number(profile?.credits || 0).toLocaleString()}
            </p>
          </div>

          {/* Amount */}
          <div className="mt-5">
            <label htmlFor="amount" className="text-sm font-medium">
              Contribution Amount
            </label>

            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500">
                ৳
              </span>

              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border bg-background py-3 pl-8 pr-4 outline-none transition focus:border-primary"
                disabled={submitting}
              />
            </div>

            <p className="mt-2 text-xs text-default-500">
              Maximum campaign contribution: ৳
              {Math.max(remainingCampaignAmount, 0).toLocaleString()}
            </p>
          </div>

          {/* Remaining Credits */}
          {amount && contributionAmount > 0 && (
            <div className="mt-5 rounded-lg border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-default-500">Contribution</span>

                <span className="font-medium">
                  ৳{contributionAmount.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-default-500">
                  Credits after contribution
                </span>

                <span
                  className={`font-semibold ${
                    remainingCredits < 0 ? "text-danger" : "text-success"
                  }`}
                >
                  ৳{Math.max(remainingCredits, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting Contribution..." : "Submit Contribution"}
          </button>

          <p className="mt-3 text-center text-xs text-default-500">
            Your contribution will be submitted for approval.
          </p>
        </form>
      </div>
    </section>
  );
}
