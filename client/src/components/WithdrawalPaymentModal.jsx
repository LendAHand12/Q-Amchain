import React, { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { transferUSDT, getUSDTBalance } from "../utils/payment";
import WalletConnect from "./WalletConnect";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatAddress } from "../utils/formatAddress";

export default function WithdrawalPaymentModal({
  withdrawal,
  open,
  onClose,
  onSuccess,
}) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [usdtBalance, setUsdtBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  useEffect(() => {
    if (isConnected && address && isModalOpen) {
      loadUSDTBalance();
    }
  }, [isConnected, address, isModalOpen]);

  const loadUSDTBalance = async () => {
    if (!address) return;
    try {
      const balance = await getUSDTBalance(address);
      setUsdtBalance(balance);
    } catch (error) {
      console.error("Load USDT balance error:", error);
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!withdrawal || !withdrawal.walletAddress || !withdrawal.amount) {
      toast.error("Invalid withdrawal information");
      return;
    }

    if (chainId !== 56) {
      toast.error("Please switch to BSC Mainnet (Chain ID: 56)");
      return;
    }

    const balanceNum = parseFloat(usdtBalance);
    const amountNum = parseFloat(withdrawal.amount);

    if (balanceNum < amountNum) {
      toast.error(
        `Insufficient USDT balance. You have ${balanceNum.toFixed(4)} USDT, need ${amountNum} USDT`
      );
      return;
    }

    setLoading(true);

    try {
      // Transfer USDT to user's wallet
      const transactionHash = await transferUSDT(
        withdrawal.walletAddress,
        withdrawal.amount.toString(),
        address
      );

      if (transactionHash) {
        // Complete withdrawal with transaction hash
        setVerifying(true);
        await completeWithdrawal(transactionHash);
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error?.message) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const completeWithdrawal = async (transactionHash) => {
    try {
      const response = await api.put(`/withdrawals/${withdrawal._id}/complete`, {
        transactionHash,
      });

      if (response.data.success) {
        toast.success("Withdrawal payment completed successfully!");
        await loadUSDTBalance();
        onSuccess?.();
        setIsModalOpen(false);
        onClose();
      }
    } catch (error) {
      console.error("Complete withdrawal error:", error);
      toast.error(error.response?.data?.message || "Failed to complete withdrawal");
    }
  };

  if (!withdrawal) return null;

  const isCorrectNetwork = chainId === 56;

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      if (loading || verifying) {
        setIsModalOpen(true);
        return;
      }
      setIsModalOpen(false);
      onClose();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        onEscapeKeyDown={(e) => {
          if (loading || verifying) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (loading || verifying) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Pay Withdrawal</DialogTitle>
          <DialogDescription>
            Send USDT to user's wallet address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Withdrawal Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Withdrawal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User:</span>
                <span className="font-medium">{withdrawal.userId?.username || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-sm">{withdrawal.userId?.email || "N/A"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Amount to Pay:</span>
                <span>{withdrawal.amount} {withdrawal.currency || "USDT"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <WalletConnect />
              {!isCorrectNetwork && isConnected && (
                <Badge variant="destructive">Please switch to BSC Mainnet</Badge>
              )}
              {isConnected && address && (
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USDT Balance:</span>
                    <span className="font-medium">{parseFloat(usdtBalance).toFixed(4)} USDT</span>
                  </div>
                  {parseFloat(usdtBalance) < parseFloat(withdrawal.amount) && (
                    <Badge variant="destructive" className="text-xs">
                      Insufficient balance
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipient Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipient Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="font-mono text-sm break-all text-muted-foreground"
                title={withdrawal.walletAddress}
              >
                {formatAddress(withdrawal.walletAddress)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This is the user's registered wallet address
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading || verifying}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={
              !isConnected ||
              !isCorrectNetwork ||
              loading ||
              verifying ||
              parseFloat(usdtBalance) < parseFloat(withdrawal.amount)
            }
          >
            {verifying
              ? "Completing..."
              : loading
              ? "Processing..."
              : `Pay ${withdrawal.amount} USDT`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

