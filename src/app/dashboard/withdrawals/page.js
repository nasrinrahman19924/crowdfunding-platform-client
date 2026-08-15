"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";

const paymentMethods = [
  {
    id: "stripe",
    label: "Stripe",
  },
  {
    id: "bkash",
    label: "bKash",
  },
  {
    id: "rocket",
    label: "Rocket",
  },
  {
    id: "nagad",
    label: "Nagad",
  },
];

export default function WithdrawalsPage() {
  const [withdrawalCredits, setWithdrawalCredits] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [totalRaisedCredits, setTotalRaisedCredits] = useState(0);
  const [totalWithdrawnCredits, setTotalWithdrawnCredits] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);

  const [loading, setLoading] = useState(true);

  const minimumWithdrawalCredits = 200;

  // Load creator withdrawal data
  useEffect(() => {
    const loadWithdrawalData = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await authClient.getSession();

        if (sessionError || !sessionData?.user) {
          console.error("User session not found");
          return;
        }

        const creatorEmail = sessionData.user.email;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals?creator_email=${encodeURIComponent(
            creatorEmail,
          )}`,
        );

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to load withdrawal data:", result);
          return;
        }

        setTotalRaisedCredits(result.totalRaisedCredits || 0);
        setTotalWithdrawnCredits(result.totalWithdrawnCredits || 0);
        setAvailableCredits(result.availableCredits || 0);
        setWithdrawals(result.withdrawals || []);
      } catch (error) {
        console.error("Load withdrawal data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWithdrawalData();
  }, []);

  // Business logic
  // 20 credits = $1
  const totalWithdrawalAmount = totalRaisedCredits / 20;

  const creditsToWithdraw = Number(withdrawalCredits) || 0;

  const withdrawalAmount = creditsToWithdraw / 20;

  const canWithdraw = availableCredits >= minimumWithdrawalCredits;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canWithdraw) {
      return;
    }

    if (!creditsToWithdraw) {
      alert("Please enter the credits you want to withdraw.");
      return;
    }

    if (creditsToWithdraw > availableCredits) {
      alert("You cannot withdraw more than your available credits.");
      return;
    }

    if (creditsToWithdraw < minimumWithdrawalCredits) {
      alert("Minimum withdrawal is 200 credits.");
      return;
    }

    if (creditsToWithdraw % 20 !== 0) {
      alert("Withdrawal credits must be a multiple of 20.");
      return;
    }

    if (!paymentSystem) {
      alert("Please select a payment system.");
      return;
    }

    if (!accountNumber.trim()) {
      alert("Please enter your account number.");
      return;
    }

    try {
      setSubmitting(true);

      const { data: sessionData, error: sessionError } =
        await authClient.getSession();

      if (sessionError || !sessionData?.user) {
        alert("Please login first.");
        return;
      }

      const creatorEmail = sessionData.user.email;
      const creatorName = sessionData.user.name;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creator_email: creatorEmail,
            creator_name: creatorName,
            withdrawal_credit: creditsToWithdraw,
            payment_system: paymentSystem,
            account_number: accountNumber,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Withdrawal request failed.");
        return;
      }

      setTotalRaisedCredits(result.totalRaisedCredits || 0);
      setTotalWithdrawnCredits(result.totalWithdrawnCredits || 0);
      setAvailableCredits(result.availableCredits || 0);

      if (result.withdrawal) {
        setWithdrawals((prev) => [result.withdrawal, ...prev]);
      }

      alert("Withdrawal request submitted successfully.");

      setWithdrawalCredits("");
      setPaymentSystem("");
      setAccountNumber("");
    } catch (error) {
      console.error("Withdrawal request error:", error);

      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-default-500">
              Loading withdrawal information...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Withdrawals
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-default-500 md:text-base">
            Withdraw your raised credits and manage your payment requests.
          </p>
        </div>

        {/* Earnings Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Raised */}
          <Card className="border bg-background shadow-sm">
            <Card.Content className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-default-500">
                    Total Raised Credits
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {totalRaisedCredits.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-default-500">
                    Credits raised from your campaigns
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
                  C
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Available Credits */}
          <Card className="border bg-background shadow-sm">
            <Card.Content className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-default-500">
                    Available Withdrawal Credits
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {availableCredits.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-default-500">
                    After previous withdrawals
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-lg font-bold text-success">
                  ✓
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Total Withdrawal Value */}
          <Card className="border bg-background shadow-sm">
            <Card.Content className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-default-500">
                    Total Withdrawal Value
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    ${totalWithdrawalAmount.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-default-500">
                    Based on 20 credits = $1
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-lg font-bold text-success">
                  $
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Withdrawal Conversion */}
        <div className="mt-6 rounded-2xl border bg-default-50 p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Withdrawal Conversion</h2>

              <p className="mt-1 text-sm text-default-500">
                Creators receive $1 for every 20 credits raised.
              </p>
            </div>

            <div className="rounded-xl bg-background px-5 py-3 text-center shadow-sm">
              <span className="text-lg font-bold">20 Credits</span>

              <span className="mx-2 text-default-400">=</span>

              <span className="text-lg font-bold text-primary">$1</span>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="mt-8">
          <Card className="border bg-background shadow-sm">
            <Card.Header className="border-b">
              <Card.Title className="text-xl font-bold">
                Request Withdrawal
              </Card.Title>

              <Card.Description>
                Enter the credits you want to withdraw and choose your preferred
                payment system.
              </Card.Description>
            </Card.Header>

            <Card.Content className="p-5 md:p-7">
              {!canWithdraw ? (
                /* Insufficient Credit */
                <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-xl font-bold">
                    !
                  </div>

                  <h2 className="mt-4 text-lg font-semibold">
                    Insufficient credit
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-default-500">
                    You need at least 200 raised credits to make a withdrawal
                    request.
                  </p>

                  <p className="mt-3 text-sm font-medium">
                    Available withdrawal credits:{" "}
                    <span className="text-primary">{availableCredits}</span>
                  </p>

                  <p className="mt-1 text-xs text-default-500">
                    Minimum required: {minimumWithdrawalCredits} credits
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Credits + Withdrawal Amount */}
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Credits To Withdraw */}
                    <TextField isRequired>
                      <Label>Credits To Withdraw</Label>

                      <Input
                        type="number"
                        min={minimumWithdrawalCredits}
                        max={availableCredits}
                        step={20}
                        value={withdrawalCredits}
                        onChange={(event) =>
                          setWithdrawalCredits(event.target.value)
                        }
                        placeholder="Enter credits"
                      />

                      <p className="mt-1 text-xs text-default-500">
                        Minimum: {minimumWithdrawalCredits} credits · Maximum:{" "}
                        {availableCredits} credits
                      </p>
                    </TextField>

                    {/* Withdrawal Amount */}
                    <TextField>
                      <Label>Withdrawal Amount ($)</Label>

                      <Input
                        type="number"
                        value={withdrawalAmount.toFixed(2)}
                        readOnly
                      />

                      <p className="mt-1 text-xs text-default-500">
                        Automatically calculated at 20 credits = $1
                      </p>
                    </TextField>
                  </div>

                  {/* Calculation Preview */}
                  <div className="rounded-2xl border bg-default-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-default-500">
                          You are withdrawing
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          {creditsToWithdraw.toLocaleString()} Credits
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-default-500">
                          You will receive
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                          ${withdrawalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment System */}
                  <Select
                    selectedKey={paymentSystem}
                    onSelectionChange={(value) => {
                      setPaymentSystem(value);
                    }}
                    isRequired
                  >
                    <Label>Select Payment System</Label>

                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                      <ListBox>
                        {paymentMethods.map((method) => (
                          <ListBox.Item
                            key={method.id}
                            id={method.id}
                            textValue={method.label}
                          >
                            {method.label}

                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {/* Account Number */}
                  <TextField isRequired>
                    <Label>Account Number</Label>

                    <Input
                      value={accountNumber}
                      onChange={(event) => setAccountNumber(event.target.value)}
                      placeholder="Enter your account number"
                    />

                    <p className="mt-1 text-xs text-default-500">
                      Enter the account number associated with your selected
                      payment system.
                    </p>
                  </TextField>

                  {/* Submit */}
                  <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">Withdrawal request</p>

                      <p className="mt-1 text-xs text-default-500">
                        Your request will be reviewed and processed.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      isDisabled={
                        submitting ||
                        !creditsToWithdraw ||
                        creditsToWithdraw < minimumWithdrawalCredits ||
                        creditsToWithdraw > availableCredits ||
                        creditsToWithdraw % 20 !== 0
                      }
                      className="w-full sm:w-auto"
                    >
                      {submitting ? "Submitting..." : "Withdraw"}
                    </Button>
                  </div>
                </form>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Payment History */}
        <div className="mt-8">
          <Card className="border bg-background shadow-sm">
            <Card.Header className="border-b">
              <Card.Title className="text-xl font-bold">
                Payment History
              </Card.Title>

              <Card.Description>
                Track your withdrawal requests and their current status.
              </Card.Description>
            </Card.Header>

            <Card.Content className="p-5 md:p-7">
              {withdrawals.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center md:p-12">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-default-100 text-lg">
                    $
                  </div>

                  <h2 className="mt-4 font-semibold">
                    No withdrawal history yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-default-500">
                    Once you submit a withdrawal request, your payment history
                    and request status will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Credits</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">
                          Payment System
                        </th>
                        <th className="px-4 py-3 font-semibold">Account</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr
                          key={withdrawal._id}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-4 py-4">
                            {new Date(
                              withdrawal.withdraw_date,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="px-4 py-4 font-medium">
                            {Number(
                              withdrawal.withdrawal_credit || 0,
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-4 font-semibold">
                            $
                            {Number(withdrawal.withdrawal_amount || 0).toFixed(
                              2,
                            )}
                          </td>

                          <td className="px-4 py-4 capitalize">
                            {withdrawal.payment_system}
                          </td>

                          <td className="px-4 py-4">
                            {withdrawal.account_number}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                withdrawal.status === "pending"
                                  ? "bg-warning/10 text-warning"
                                  : withdrawal.status === "approved"
                                    ? "bg-primary/10 text-primary"
                                    : withdrawal.status === "completed"
                                      ? "bg-success/10 text-success"
                                      : "bg-default-100 text-default-500"
                              }`}
                            >
                              {withdrawal.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </section>
  );
}
