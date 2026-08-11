"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function CampaignDetailsPage() {
  const params = useParams();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [supportAmount, setSupportAmount] = useState("");
  const [supporting, setSupporting] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [userCredits, setUserCredits] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${params.id}`,
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load campaign");
          return;
        }

        setCampaign(result.campaign);
      } catch (error) {
        console.error("Load campaign error:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCampaign();
    }
  }, [params.id]);

  useEffect(() => {
    const loadUserCredits = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          setUserCredits(null);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?email=${encodeURIComponent(
            data.user.email,
          )}`,
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load user profile:", result);
          return;
        }

        setUserCredits(result.user?.credits ?? 0);
      } catch (error) {
        console.error("Load user credits error:", error);
      }
    };

    loadUserCredits();
  }, []);

  const handleSupport = async () => {
    setSupportMessage("");

    const amount = Number(supportAmount);

    // 1. Check support amount
    if (!amount || amount <= 0) {
      setSupportMessage("Please enter a valid support amount.");
      return;
    }

    // 2. Check user's available credits
    if (userCredits !== null && amount > userCredits) {
      setSupportMessage(`You only have ${userCredits} credits available.`);
      return;
    }

    // 3. Check remaining campaign goal
    const remainingAmount = campaign.goalAmount - campaign.raisedAmount;

    if (amount > remainingAmount) {
      setSupportMessage(
        `You can support up to ৳${remainingAmount.toLocaleString()}.`,
      );
      return;
    }

    try {
      setSupporting(true);

      // Get logged-in user
      const { data, error } = await authClient.getSession();

      if (error || !data?.user) {
        setSupportMessage("Please login to support this campaign.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${params.id}/support`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supporterEmail: data.user.email,
            amount,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setSupportMessage(result.message || "Support failed.");
        return;
      }

      // Update campaign and credits
      setCampaign(result.campaign);
      setUserCredits(result.credits);
      setSupportAmount("");

      setSupportMessage(
        `Successfully supported this campaign with ৳${amount}.`,
      );
    } catch (error) {
      console.error("Support campaign error:", error);

      setSupportMessage("Something went wrong. Please try again.");
    } finally {
      setSupporting(false);
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-default-500">Loading campaign...</p>
        </div>
      </section>
    );
  }

  if (error || !campaign) {
    return (
      <section className="p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h1 className="text-xl font-semibold">Campaign Not Found</h1>

            <p className="mt-2 text-sm text-default-500">
              {error || "This campaign does not exist."}
            </p>

            <Link
              href="/campaigns"
              className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Campaigns
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const progress =
    campaign.goalAmount > 0
      ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
      : 0;

  const formattedDeadline = new Date(campaign.deadline).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/campaigns"
          className="mb-6 inline-flex text-sm font-medium text-default-500 hover:text-foreground"
        >
          ← Back to Campaigns
        </Link>

        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          {/* Image */}
          <div className="aspect-video overflow-hidden bg-default-100">
            {campaign.image ? (
              <img
                src={campaign.image}
                alt={campaign.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-default-500">
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Category + Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium capitalize">
                {campaign.category}
              </span>

              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium capitalize text-success">
                {campaign.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              {campaign.title}
            </h1>

            {/* Creator */}
            <p className="mt-3 text-sm text-default-500">
              Created by{" "}
              <span className="font-medium text-foreground">
                {campaign.creatorName}
              </span>
            </p>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">About this campaign</h2>

              <p className="mt-2 whitespace-pre-line leading-7 text-default-600">
                {campaign.description}
              </p>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span>Raised</span>

                <span className="font-semibold">{progress.toFixed(0)}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-default-100">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-xs text-default-500">Goal</p>

                <p className="mt-1 text-xl font-bold">
                  ৳{campaign.goalAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-xs text-default-500">Raised</p>

                <p className="mt-1 text-xl font-bold">
                  ৳{campaign.raisedAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-default-50 p-4">
                <p className="text-xs text-default-500">Deadline</p>

                <p className="mt-1 text-xl font-bold">{formattedDeadline}</p>
              </div>
            </div>

            {/* Support Campaign */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold">Support This Campaign</h2>

              <p className="mt-2 text-sm text-default-500">
                Enter the amount you want to contribute to this campaign.
              </p>

              {userCredits !== null && (
                <div className="mt-4 rounded-lg bg-default-50 px-4 py-3">
                  <p className="text-sm text-default-500">Available Credits</p>

                  <p className="mt-1 text-lg font-semibold">{userCredits}</p>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  min="1"
                  value={supportAmount}
                  onChange={(e) => setSupportAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border bg-transparent px-4 py-3 outline-none focus:border-primary sm:flex-1"
                />

                <button
                  type="button"
                  onClick={handleSupport}
                  disabled={supporting}
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {supporting ? "Supporting..." : "Support Campaign"}
                </button>
              </div>

              {supportMessage && (
                <p className="mt-3 text-sm text-default-500">
                  {supportMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
