import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditRefCodeOpen, setIsEditRefCodeOpen] = useState(false);
  const [newRefCode, setNewRefCode] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/users/dashboard");
      setStats(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/register?ref=${stats?.refCode}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Referral link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const handleEditRefCode = () => {
    setNewRefCode(stats?.refCode || "");
    setIsEditRefCodeOpen(true);
  };

  const handleUpdateRefCode = async () => {
    if (!newRefCode.trim()) {
      toast.error("RefCode cannot be empty");
      return;
    }

    // Validate format: lowercase alphanumeric, min 6 chars
    const refCodeRegex = /^[a-z0-9]{6,}$/;
    if (!refCodeRegex.test(newRefCode.trim().toLowerCase())) {
      toast.error("RefCode must be lowercase alphanumeric and at least 6 characters");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await api.put("/users/refcode", {
        refCode: newRefCode.trim().toLowerCase(),
      });

      if (response.data.success) {
        toast.success("RefCode updated successfully!");
        setIsEditRefCodeOpen(false);
        fetchDashboard(); // Refresh dashboard
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update RefCode");
    } finally {
      setIsUpdating(false);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {stats?.totalEarnings?.toFixed(2) || "0.00"} USDT
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.walletBalance?.toFixed(2) || "0.00"} USDT
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">F1 Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.f1Earnings?.toFixed(2) || "0.00"} USDT
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">F2 Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats?.f2Earnings?.toFixed(2) || "0.00"} USDT
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Direct Referrals (F1)</CardTitle>
            <CardDescription>Number of users you referred directly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.directReferrals || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchased Package</CardTitle>
            <CardDescription>Your purchased package</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.purchasedPackageName ? (
              <Badge variant="outline" className="text-lg px-3 py-1">
                {stats.purchasedPackageName}
              </Badge>
            ) : (
              <p className="text-muted-foreground">No package purchased yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Referral Code</CardTitle>
            <CardDescription>Share this code to earn commissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.refCode ? (
              <>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-base sm:text-lg font-mono px-3 py-1 flex-1 text-center sm:text-left"
                  >
                    {stats.refCode}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditRefCode}
                    className="shrink-0 w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground font-semibold flex-1">
                      Share Link:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {window.location.origin}/register?ref={stats.refCode}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No referral code available</p>
            )}
          </CardContent>
        </Card>

        {/* Edit RefCode Dialog */}
        <Dialog open={isEditRefCodeOpen} onOpenChange={setIsEditRefCodeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Referral Code</DialogTitle>
              <DialogDescription>
                Change your referral code. Must be lowercase alphanumeric, minimum 6 characters, and
                unique.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="refCode">New Referral Code</Label>
                <Input
                  id="refCode"
                  value={newRefCode}
                  onChange={(e) =>
                    setNewRefCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))
                  }
                  placeholder="Enter new refCode (min 6 chars)"
                  minLength={6}
                  pattern="[a-z0-9]{6,}"
                />
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters and numbers, minimum 6 characters
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditRefCodeOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateRefCode} disabled={isUpdating || newRefCode.length < 6}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <Link to="/dashboard/packages">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="font-semibold">My Packages</div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Link to="/dashboard/commissions">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold">Commissions</div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Link to="/dashboard/referral-tree">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🌳</div>
                <div className="font-semibold">Referral Tree</div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Link to="/dashboard/withdraw">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">💸</div>
                <div className="font-semibold">Withdraw</div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
