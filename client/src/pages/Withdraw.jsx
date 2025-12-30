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
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  useEffect(() => {
    checkAuth()
    fetchWithdrawals()
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

  const onSubmit = async (data) => {
    try {
      await api.post('/withdrawals/request', data)
      toast.success('Withdrawal request submitted successfully')
      reset()
      fetchWithdrawals()
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Withdrawal Form */}
        <Card>
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

        {/* Withdrawal History */}
        <Card>
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
                        <div>
                          <p className="font-semibold">
                            {withdrawal.amount} {withdrawal.currency}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {formatAddress(withdrawal.walletAddress)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(withdrawal.createdAt)}
                          </p>
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
                        <a
                          href={`https://bscscan.com/tx/${withdrawal.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-mono mt-2 hover:underline block"
                          title={withdrawal.transactionHash}
                        >
                          TX: {formatAddress(withdrawal.transactionHash)}
                        </a>
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

