import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatDateTime } from "../../utils/dateFormat";
import { formatAddress } from "../../utils/formatAddress";
import { ArrowLeft, Edit, Save, X, Trash2 } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignPackageDialog, setShowAssignPackageDialog] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [newParentRefCode, setNewParentRefCode] = useState("");
  const [moveWithChildren, setMoveWithChildren] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
    fetchPackages();
  }, [id]);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/packages");
      setPackages(response.data.data || []);
    } catch (error) {
      console.error("Failed to load packages");
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data.data);
      const user = response.data.data.user;
      // Set form values
      setValue("username", user.username || "");
      setValue("email", user.email || "");
      setValue("walletAddress", user.walletAddress || "");
      setValue("fullName", user.fullName || "");
      setValue("phoneNumber", user.phoneNumber || "");
      setValue("identityNumber", user.identityNumber || "");
    } catch (error) {
      toast.error("Failed to load user details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserInfo = async (data) => {
    try {
      await api.put(`/admin/users/${id}`, {
        username: data.username?.trim(),
        email: data.email?.trim(),
        walletAddress: data.walletAddress?.trim(),
        fullName: data.fullName?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        identityNumber: data.identityNumber?.trim(),
      });
      toast.success("User information updated successfully");
      setIsEditing(false);
      // Refresh user details
      fetchUserDetails(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user information");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (userDetails) {
      const user = userDetails.user;
      setValue("username", user.username || "");
      setValue("email", user.email || "");
      setValue("walletAddress", user.walletAddress || "");
      setValue("fullName", user.fullName || "");
      setValue("phoneNumber", user.phoneNumber || "");
      setValue("identityNumber", user.identityNumber || "");
    }
  };


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      // Navigate back to users list after deletion
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAssignPackage = async () => {
    if (!selectedPackageId) {
      toast.error("Please select a package");
      return;
    }

    setIsAssigning(true);
    try {
      await api.put(`/admin/users/${id}/assign-package`, {
        packageId: selectedPackageId,
      });
      toast.success("Package assigned successfully!");
      setShowAssignPackageDialog(false);
      setSelectedPackageId("");
      fetchUserDetails(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign package");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    try {
      await api.put(`/admin/users/${id}/verify-email`);
      toast.success("User email verified successfully");
      fetchUserDetails(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify email");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleTransferUser = async () => {
    if (!newParentRefCode || !newParentRefCode.trim()) {
      toast.error("Please enter new parent's refCode or username");
      return;
    }

    setIsTransferring(true);
    try {
      await api.put(`/admin/users/${id}/transfer`, {
        newParentRefCode: newParentRefCode.trim(),
        moveWithChildren: moveWithChildren,
      });
      toast.success("User transferred successfully");
      setShowTransferDialog(false);
      setNewParentRefCode("");
      setMoveWithChildren(true);
      fetchUserDetails(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to transfer user");
    } finally {
      setIsTransferring(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-muted-foreground">User not found</div>
        <Button onClick={() => navigate("/admin/users")} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">{userDetails.user.username}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">User Info</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="referrals">Referral Network</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        {/* User Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Basic Information</CardTitle>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User Info
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowTransferDialog(true)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Transfer User
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSubmit(handleUpdateUserInfo)} disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setShowDeleteDialog(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSubmit(handleUpdateUserInfo)}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Username</Label>
                    {isEditing ? (
                      <Input
                        {...register("username", {
                          required: "Username is required",
                          pattern: {
                            value: /^[a-z0-9]+$/,
                            message: "Username must be lowercase alphanumeric, no spaces",
                          },
                        })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{userDetails.user.username}</p>
                    )}
                    {errors.username && (
                      <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                          },
                        })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{userDetails.user.email}</p>
                    )}
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ref Code</Label>
                    <p className="font-mono font-medium">{userDetails.user.refCode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Wallet Address</Label>
                    {isEditing ? (
                      <Input
                        {...register("walletAddress", {
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/,
                            message: "Invalid BEP20 wallet address format",
                          },
                        })}
                        placeholder="0x..."
                        className="mt-1 font-mono text-sm"
                      />
                    ) : (
                      <p className="font-mono text-sm">
                        {userDetails.user.walletAddress
                          ? formatAddress(userDetails.user.walletAddress)
                          : "Not set"}
                      </p>
                    )}
                    {errors.walletAddress && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.walletAddress.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    {isEditing ? (
                      <Input
                        {...register("fullName", {
                          maxLength: {
                            value: 100,
                            message: "Full name must be less than 100 characters",
                          },
                        })}
                        placeholder="Full name as on ID card"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{userDetails.user.fullName || "Not provided"}</p>
                    )}
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        {...register("phoneNumber", {
                          maxLength: {
                            value: 20,
                            message: "Phone number must be less than 20 characters",
                          },
                        })}
                        placeholder="Phone number"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{userDetails.user.phoneNumber || "Not provided"}</p>
                    )}
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Identity Number</Label>
                    {isEditing ? (
                      <Input
                        {...register("identityNumber", {
                          maxLength: {
                            value: 50,
                            message: "Identity number must be less than 50 characters",
                          },
                        })}
                        placeholder="ID card, passport, or identity number"
                        className="mt-1 font-mono text-sm"
                      />
                    ) : (
                      <p className="font-mono text-sm">
                        {userDetails.user.identityNumber || "Not provided"}
                      </p>
                    )}
                    {errors.identityNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.identityNumber.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Wallet Balance (USDT)</Label>
                    <p className="font-medium">
                      {userDetails.user.walletBalance?.toFixed(2) || "0.00"} USDT
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Earnings (USDT)</Label>
                    <p className="font-medium">
                      {userDetails.user.totalEarnings?.toFixed(2) || "0.00"} USDT
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Direct Referrals (F1)</Label>
                    <p className="font-medium">{userDetails.referrals?.f1?.length || 0}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email Verified</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={userDetails.user.isEmailVerified ? "default" : "outline"}>
                        {userDetails.user.isEmailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                      {!userDetails.user.isEmailVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleVerifyEmail}
                          disabled={isVerifyingEmail}
                          className="ml-2"
                        >
                          {isVerifyingEmail ? "Verifying..." : "Verify Email"}
                        </Button>
                      )}
                    </div>
                  </div>
                  {userDetails.user.parentId && (
                    <div>
                      <Label className="text-muted-foreground">Referred By</Label>
                      <p className="font-medium">
                        {userDetails.user.parentId.username} ({userDetails.user.parentId.refCode})
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Registered Date</Label>
                    <p className="text-sm">{formatDate(userDetails.user.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Package</Label>
                    <div className="flex items-center gap-2">
                      {userDetails.purchasedPackage ? (
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{userDetails.purchasedPackage.name}</p>
                          {userDetails.isPackageAssigned ? (
                            <Badge variant="secondary" className="text-xs">
                              Assigned by Admin
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-xs">
                              Purchased
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <>
                          <p className="text-muted-foreground">No package yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAssignPackageDialog(true)}
                            className="ml-2"
                            type="button"
                          >
                            Assign Package
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {userDetails.purchasedPackage && (
                    <>
                      {userDetails.purchasedPackage.description && (
                        <div>
                          <Label className="text-muted-foreground">Package Description</Label>
                          <p className="text-sm">{userDetails.purchasedPackage.description}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-muted-foreground">Package Price</Label>
                        <p className="font-semibold">
                          {userDetails.purchasedPackage.price} USDT
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All transactions: Payments, Commissions, Withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDetails.transactions?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.transactions?.map((tx) => (
                      <TableRow key={tx._id}>
                        <TableCell>
                          <Badge
                            variant={
                              tx.type === "payment"
                                ? "default"
                                : tx.type === "commission"
                                ? "secondary"
                                : tx.type === "withdrawal"
                                ? "outline"
                                : "outline"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {tx.amount} {tx.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.status === "completed"
                                ? "default"
                                : tx.status === "pending"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.packageId?.name || "N/A"}</TableCell>
                        <TableCell>
                          {tx.transactionHash ? (
                            <a
                              href={`https://bscscan.com/tx/${tx.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-primary hover:underline"
                              title={tx.transactionHash}
                            >
                              {formatAddress(tx.transactionHash)}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(tx.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referral Network Tab */}
        <TabsContent value="referrals" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">F1 (Direct Referrals)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userDetails.referrals?.f1?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">F2 (Indirect Referrals)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userDetails.referrals?.f2?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>F1 Referrals (Direct)</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.referrals?.f1?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No F1 referrals</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Purchased Package</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.referrals.f1.map((ref) => (
                      <TableRow key={ref._id}>
                        <TableCell className="font-medium">{ref.username}</TableCell>
                        <TableCell>{ref.email}</TableCell>
                        <TableCell className="font-mono text-sm">{ref.refCode}</TableCell>
                        <TableCell>
                          {ref.purchasedPackageName ? (
                            <Badge variant="outline">{ref.purchasedPackageName}</Badge>
                          ) : (
                            <span className="text-muted-foreground">No package</span>
                          )}
                        </TableCell>
                        <TableCell>{ref.totalEarnings?.toFixed(2) || "0.00"} USDT</TableCell>
                        <TableCell>{ref.walletBalance?.toFixed(2) || "0.00"} USDT</TableCell>
                        <TableCell className="text-sm">{formatDate(ref.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${ref._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>F2 Referrals (Indirect)</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.referrals?.f2?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No F2 referrals</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>F1 Parent</TableHead>
                      <TableHead>Purchased Package</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.referrals.f2.map((ref) => (
                      <TableRow key={ref._id}>
                        <TableCell className="font-medium">{ref.username}</TableCell>
                        <TableCell>{ref.email}</TableCell>
                        <TableCell className="font-mono text-sm">{ref.refCode}</TableCell>
                        <TableCell>
                          {ref.parentId?.username} ({ref.parentId?.refCode})
                        </TableCell>
                        <TableCell>
                          {ref.purchasedPackageName ? (
                            <Badge variant="outline">{ref.purchasedPackageName}</Badge>
                          ) : (
                            <span className="text-muted-foreground">No package</span>
                          )}
                        </TableCell>
                        <TableCell>{ref.totalEarnings?.toFixed(2) || "0.00"} USDT</TableCell>
                        <TableCell>{ref.walletBalance?.toFixed(2) || "0.00"} USDT</TableCell>
                        <TableCell className="text-sm">{formatDate(ref.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${ref._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>Commissions earned from referrals</CardDescription>
            </CardHeader>
            <CardContent>
              {userDetails.commissions?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No commissions yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.commissions.map((commission) => (
                      <TableRow key={commission._id}>
                        <TableCell className="text-sm">
                          {formatDate(commission.createdAt)}
                        </TableCell>
                        <TableCell>{commission.buyerId?.username || "N/A"}</TableCell>
                        <TableCell>{commission.packageId?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={commission.level === 1 ? "default" : "secondary"}>
                            F{commission.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {commission.amount.toFixed(2)} USDT
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-800 border-green-200"
                          >
                            {commission.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Package Dialog */}
      <Dialog open={showAssignPackageDialog} onOpenChange={setShowAssignPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Package to User</DialogTitle>
            <DialogDescription>
              Select a package to assign to {userDetails?.user?.username}. This will create a free package assignment without payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="package">Select Package</Label>
              <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>
                      {pkg.name} - {pkg.price} USDT
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPackageId && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  {(() => {
                    const selectedPkg = packages.find((p) => p._id === selectedPackageId);
                    return selectedPkg ? (
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{selectedPkg.name}</p>
                        {selectedPkg.description && (
                          <p className="text-muted-foreground">{selectedPkg.description}</p>
                        )}
                        <p className="font-semibold">Price: {selectedPkg.price} USDT</p>
                        <p className="text-xs text-muted-foreground">
                          Commission F1: {selectedPkg.commissionLv1}% | F2: {selectedPkg.commissionLv2}%
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignPackageDialog(false);
                setSelectedPackageId("");
              }}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignPackage} disabled={!selectedPackageId || isAssigning}>
              {isAssigning ? "Assigning..." : "Assign Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{userDetails?.user?.username}</strong>? 
              This action will soft delete the user and free up their unique information (email, username, refCode, phone number, wallet address, identity number) for reuse by other users.
              <br /><br />
              <span className="text-destructive font-semibold">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer User Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer User</DialogTitle>
            <DialogDescription>
              Transfer user <strong>{userDetails?.user?.username}</strong> to a new parent in the referral tree.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Current Parent Info */}
            {userDetails?.user?.parentId ? (
              <div className="p-3 bg-muted rounded-md">
                <Label className="text-sm font-semibold">Current Parent:</Label>
                <p className="text-sm mt-1">
                  {userDetails.user.parentId.username} ({userDetails.user.parentId.refCode})
                </p>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md">
                <Label className="text-sm font-semibold">Current Parent:</Label>
                <p className="text-sm mt-1 text-muted-foreground">No parent (root user)</p>
              </div>
            )}

            {/* Children Count */}
            {userDetails?.referrals?.f1 && userDetails.referrals.f1.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <Label className="text-sm font-semibold text-blue-900">Direct Children:</Label>
                <p className="text-sm mt-1 text-blue-700">
                  This user has <strong>{userDetails.referrals.f1.length}</strong> direct child(ren)
                </p>
              </div>
            )}

            {/* New Parent Input */}
            <div className="space-y-2">
              <Label htmlFor="newParentRefCode">New Parent RefCode or Username *</Label>
              <Input
                id="newParentRefCode"
                value={newParentRefCode}
                onChange={(e) => setNewParentRefCode(e.target.value)}
                placeholder="Enter refCode or username"
                disabled={isTransferring}
              />
              <p className="text-xs text-muted-foreground">
                Enter the refCode or username of the new parent user
              </p>
            </div>

            {/* Transfer Option */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Transfer Option:</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="transferOption"
                    checked={moveWithChildren}
                    onChange={() => setMoveWithChildren(true)}
                    disabled={isTransferring}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Move with children</div>
                    <div className="text-xs text-muted-foreground">
                      Transfer this user and all their direct children to the new parent
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="transferOption"
                    checked={!moveWithChildren}
                    onChange={() => setMoveWithChildren(false)}
                    disabled={isTransferring}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Move without children</div>
                    <div className="text-xs text-muted-foreground">
                      Transfer only this user. Their children will stay with the current parent (or become root if no parent)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-xs text-amber-800">
                <strong>Warning:</strong> This action will change the referral tree structure. 
                Future commissions will use the new parent structure. Existing commissions are not affected.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTransferDialog(false);
                setNewParentRefCode("");
                setMoveWithChildren(true);
              }}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferUser}
              disabled={!newParentRefCode.trim() || isTransferring}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTransferring ? "Transferring..." : "Transfer User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

