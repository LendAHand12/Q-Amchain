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
import { formatDate, formatDateTime } from "../../utils/dateFormat";
import { formatAddress } from "../../utils/formatAddress";
import { ArrowLeft, Edit, Save, X } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
  }, [id]);

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

  const handleLock = async () => {
    try {
      await api.put(`/admin/users/${id}/lock`);
      toast.success("User locked");
      fetchUserDetails(id);
    } catch (error) {
      toast.error("Failed to lock user");
    }
  };

  const handleUnlock = async () => {
    try {
      await api.put(`/admin/users/${id}/unlock`);
      toast.success("User unlocked");
      fetchUserDetails(id);
    } catch (error) {
      toast.error("Failed to unlock user");
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
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User Info
                    </Button>
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
                  {userDetails.user.isActive ? (
                    <Button variant="destructive" size="sm" onClick={handleLock}>
                      Lock User
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={handleUnlock}>
                      Unlock User
                    </Button>
                  )}
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
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={userDetails.user.isActive ? "default" : "destructive"}>
                      {userDetails.user.isActive ? "Active" : "Locked"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email Verified</Label>
                    <Badge variant={userDetails.user.isEmailVerified ? "default" : "outline"}>
                      {userDetails.user.isEmailVerified ? "Verified" : "Not Verified"}
                    </Badge>
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
                    <Label className="text-muted-foreground">Purchased Package</Label>
                    {userDetails.purchasedPackage ? (
                      <p className="font-semibold">{userDetails.purchasedPackage.name}</p>
                    ) : (
                      <p className="text-muted-foreground">No package purchased yet</p>
                    )}
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
    </div>
  );
}

