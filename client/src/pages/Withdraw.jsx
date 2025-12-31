import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/dateFormat";
import { formatAddress } from "../utils/formatAddress";

export default function Withdraw() {
  const { user, checkAuth } = useAuthStore()
  const [withdrawals, setWithdrawals] = useState([])
  const [balanceHistory, setBalanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  useEffect(() => {
    checkAuth()
    fetchWithdrawals()
    fetchBalanceHistory()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/withdrawals/my-requests')
      setWithdrawals(response.data.data)
    } catch (error) {
      console.error('Failed to load withdrawals')
    } finally {
      setLoading(false)
    }
  }

  const fetchBalanceHistory = async () => {
    try {
      const response = await api.get('/users/balance-history?limit=10')
      setBalanceHistory(response.data.data.history || [])
    } catch (error) {
      console.error('Failed to load balance history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      await api.post('/withdrawals/request', data)
      toast.success('Withdrawal request submitted successfully')
      reset()
      fetchWithdrawals()
      fetchBalanceHistory() // Refresh balance history
      checkAuth() // Refresh user balance
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit withdrawal request')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Withdraw Funds</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Request withdrawal to your USDT wallet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Withdrawal Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>
              Available Balance:{" "}
              <span className="font-bold text-primary">
                {user?.walletBalance?.toFixed(2) || "0.00"} USDT
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USDT)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={user?.walletBalance || 0}
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Minimum withdrawal is 1 USDT" },
                    max: {
                      value: user?.walletBalance || 0,
                      message: "Amount exceeds available balance",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Withdrawal Wallet Address</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono break-all">
                    {user?.walletAddress || "No wallet address set"}
                  </p>
                  {!user?.walletAddress && (
                    <p className="text-xs text-destructive mt-1">
                      Please contact admin to set your wallet address
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Funds will be sent to this wallet address. Contact admin to change it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {user?.isTwoFactorEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="token">2FA Code</Label>
                  <Input
                    id="token"
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    {...register("token", { required: "2FA code is required" })}
                  />
                  {errors.token && (
                    <p className="text-sm text-destructive">{errors.token.message}</p>
                  )}
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Balance History */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
            <CardDescription>Recent balance changes</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : balanceHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No balance history yet
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {balanceHistory.map((history) => (
                  <div
                    key={history._id}
                    className="flex justify-between items-start p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium break-words">{history.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(history.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Before: {history.balanceBefore.toFixed(2)} → After: {history.balanceAfter.toFixed(2)} USDT
                      </p>
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          history.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {history.amount > 0 ? "+" : ""}
                        {history.amount.toFixed(2)} USDT
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No withdrawal requests yet
              </p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <Card key={withdrawal._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {withdrawal.amount} {withdrawal.currency}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {formatAddress(withdrawal.walletAddress)}
                          </p>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <div>
                              <span>Created: </span>
                              <span>{formatDate(withdrawal.createdAt)}</span>
                            </div>
                            {withdrawal.status === "completed" && withdrawal.completedAt && (
                              <div>
                                <span>Completed: </span>
                                <span className="text-green-600">{formatDate(withdrawal.completedAt)}</span>
                              </div>
                            )}
                            {withdrawal.status === "rejected" && withdrawal.rejectedAt && (
                              <div>
                                <span>Rejected: </span>
                                <span className="text-red-600">{formatDate(withdrawal.rejectedAt)}</span>
                              </div>
                            )}
                            {withdrawal.status === "approved" && withdrawal.approvedAt && (
                              <div>
                                <span>Approved: </span>
                                <span className="text-blue-600">{formatDate(withdrawal.approvedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            withdrawal.status === "completed"
                              ? "default"
                              : withdrawal.status === "approved"
                              ? "secondary"
                              : withdrawal.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                      </div>
                      {withdrawal.transactionHash && (
                        <div className="mt-2 pt-2 border-t">
                          <a
                            href={`https://bscscan.com/tx/${withdrawal.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-mono hover:underline flex items-center gap-1"
                            title={withdrawal.transactionHash}
                          >
                            <span>TX:</span>
                            <span className="break-all">{formatAddress(withdrawal.transactionHash)}</span>
                            <svg
                              className="w-3 h-3 inline-block"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

