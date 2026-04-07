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
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

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

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/register?ref=${stats?.refCode}`;
    
    // Check if Clipboard API is available (requires HTTPS or localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(link);
        toast.success("Referral link copied to clipboard!");
        return;
      } catch (error) {
        // Fall through to fallback method
        console.warn("Clipboard API failed, using fallback:", error);
      }
    }
    
    // Fallback method for browsers/environments without Clipboard API
    try {
      const textArea = document.createElement("textarea");
      textArea.value = link;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success("Referral link copied to clipboard!");
      } else {
        throw new Error("execCommand failed");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy link. Please copy manually.");
    }
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
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Invested</CardTitle>
            <div className="text-xs text-accent-green font-semibold">+0.0%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats?.totalInvested?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-gray-400 mt-1">USDT</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Earnings</CardTitle>
            <div className="text-xs text-brand-red font-semibold">+0.0%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats?.f1Earnings && stats?.f2Earnings 
                ? (stats.f1Earnings + stats.f2Earnings).toFixed(2) 
                : "0.00"}
            </div>
            <p className="text-xs text-gray-400 mt-1">USDT</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Balance</CardTitle>
            <div className="text-xs text-accent-green font-semibold">+0.0%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-accent-green">
              {stats?.walletBalance?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-gray-400 mt-1">USDT</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Direct Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats?.directReferrals || 0}
            </div>
            <p className="text-xs text-gray-400 mt-1">F1 Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#252525] border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-base text-white">Purchased Package</CardTitle>
            <CardDescription className="text-gray-400">Your validator package</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.purchasedPackageName ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg px-3 py-1 bg-brand-red/20 text-brand-red border-brand-red">
                  {stats.purchasedPackageName}
                </Badge>
                {stats.isPackageAssigned && (
                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    Assigned by Admin
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No package purchased yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#252525] border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-base text-white">Your Referral Code</CardTitle>
            <CardDescription className="text-gray-400">
              {stats?.purchasedPackageName
                ? "Share this code to earn commissions"
                : "Purchase a package to get your referral code"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.purchasedPackageName && stats?.refCode ? (
              <>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-base sm:text-lg font-mono px-3 py-1 flex-1 text-center sm:text-left bg-gray-800 text-white border-gray-600"
                  >
                    {stats.refCode}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditRefCode}
                    className="shrink-0 w-full sm:w-auto border-gray-600 text-black hover:bg-gray-700"
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 font-semibold flex-1">
                      Share Link:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0 border-gray-600 text-black hover:bg-gray-700"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs font-mono bg-gray-800 text-gray-300 p-2 rounded break-all">
                    {window.location.origin}/register?ref={stats.refCode}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-2">
                  You need to purchase a package first to get your referral code.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/dashboard/packages")}
                  className="border-gray-600 text-black hover:text-white hover:bg-gray-700"
                >
                  Go to Packages
                </Button>
              </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to="/dashboard/packages">
          <Button className="w-full h-14 bg-brand-red hover:bg-brand-red-hover text-white font-semibold">
            Buy Package
          </Button>
        </Link>
        <Link to="/dashboard/commissions">
          <Button variant="outline" className="w-full h-14 font-semibold border-2">
            View Income
          </Button>
        </Link>
        <Link to="/dashboard/withdraw">
          <Button className="w-full h-14 bg-brand-red hover:bg-brand-red-hover text-white font-semibold">
            Withdraw
          </Button>
        </Link>
        <Link to="/dashboard/referral-tree">
          <Button variant="outline" className="w-full h-14 font-semibold border-2">
            View Network
          </Button>
        </Link>
      </div>
    </div>
  );
}
