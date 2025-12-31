import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "../../utils/dateFormat";
import { formatAddress } from "../../utils/formatAddress";
import Pagination from "../../components/Pagination";
import WithdrawalPaymentModal from "../../components/WithdrawalPaymentModal";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [withdrawalToPay, setWithdrawalToPay] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage]);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get(`/withdrawals?page=${currentPage}&limit=20`);
      setWithdrawals(response.data.data.withdrawals || []);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId) => {
    if (!confirm("Approve this withdrawal request? You will need to pay the user via Metamask.")) return;
    
    // Find the withdrawal from current list
    const withdrawalToProcess = withdrawals.find(w => w._id === withdrawalId);
    if (withdrawalToProcess) {
      // Just show payment modal, don't approve yet
      setWithdrawalToPay(withdrawalToProcess);
      setShowPaymentModal(true);
    } else {
      // If not found in list, fetch it
      try {
        const response = await api.get(`/withdrawals`);
        const allWithdrawals = response.data.data.withdrawals || [];
        const found = allWithdrawals.find(w => w._id === withdrawalId);
        if (found) {
          setWithdrawalToPay(found);
          setShowPaymentModal(true);
        } else {
          toast.error("Withdrawal not found");
        }
      } catch (error) {
        toast.error("Failed to load withdrawal details");
      }
    }
  };

  const handleReject = async (withdrawalId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await api.put(`/withdrawals/${withdrawalId}/reject`, { reason });
      toast.success("Withdrawal rejected");
      fetchWithdrawals();
    } catch (error) {
      toast.error("Failed to reject withdrawal");
    }
  };

  const handleComplete = async (data) => {
    try {
      await api.put(`/withdrawals/${selectedWithdrawal}/complete`, data);
      toast.success("Withdrawal completed");
      setShowCompleteForm(false);
      setSelectedWithdrawal(null);
      reset();
      fetchWithdrawals();
    } catch (error) {
      toast.error("Failed to complete withdrawal");
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Withdrawal Management</h1>
        <p className="text-muted-foreground">Review and process withdrawal requests</p>
      </div>

      {/* Payment Modal */}
      {withdrawalToPay && (
        <WithdrawalPaymentModal
          withdrawal={withdrawalToPay}
          open={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setWithdrawalToPay(null);
          }}
          onSuccess={() => {
            fetchWithdrawals();
          }}
        />
      )}

      <Dialog open={showCompleteForm} onOpenChange={setShowCompleteForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Withdrawal</DialogTitle>
            <DialogDescription>
              Enter the transaction hash to mark this withdrawal as completed
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleComplete)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionHash">Transaction Hash</Label>
              <Input
                id="transactionHash"
                type="text"
                placeholder="0x..."
                {...register("transactionHash", { required: "Transaction hash is required" })}
              />
              {errors.transactionHash && (
                <p className="text-sm text-destructive">{errors.transactionHash.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCompleteForm(false);
                  setSelectedWithdrawal(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Completing..." : "Complete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="text-center text-muted-foreground">
                    No withdrawals found
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
                    <TableCell>{withdrawal.userId?.username || "N/A"}</TableCell>
                    <TableCell className="font-semibold">
                      {withdrawal.amount} {withdrawal.currency}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(withdrawal.walletAddress)}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {withdrawal.transactionHash ? (
                        <a
                          href={`https://bscscan.com/tx/${withdrawal.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-mono text-sm hover:underline"
                          title={withdrawal.transactionHash}
                        >
                          {formatAddress(withdrawal.transactionHash)}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="space-y-1">
                        <div>
                          <span className="text-xs">Created: </span>
                          <span>{formatDate(withdrawal.createdAt)}</span>
                        </div>
                        {withdrawal.status === "completed" && withdrawal.completedAt && (
                          <div>
                            <span className="text-xs">Completed: </span>
                            <span className="text-green-600">{formatDate(withdrawal.completedAt)}</span>
                          </div>
                        )}
                        {withdrawal.status === "rejected" && withdrawal.rejectedAt && (
                          <div>
                            <span className="text-xs">Rejected: </span>
                            <span className="text-red-600">{formatDate(withdrawal.rejectedAt)}</span>
                          </div>
                        )}
                        {withdrawal.status === "approved" && withdrawal.approvedAt && (
                          <div>
                            <span className="text-xs">Approved: </span>
                            <span className="text-blue-600">{formatDate(withdrawal.approvedAt)}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(withdrawal._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(withdrawal._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {withdrawal.status === "approved" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal._id);
                            setShowCompleteForm(true);
                          }}
                        >
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

