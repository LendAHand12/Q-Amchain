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

export default function PaymentModal({
  package: packageData,
  paymentAddress,
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

    if (!packageData || !paymentAddress || !packageData.price) {
      toast.error("Invalid package information");
      return;
    }

    if (chainId !== 56) {
      toast.error("Please switch to BSC Mainnet (Chain ID: 56)");
      return;
    }

    const balanceNum = parseFloat(usdtBalance);
    const amountNum = parseFloat(packageData.price);

    if (balanceNum < amountNum) {
      toast.error(
        `Insufficient USDT balance. You have ${balanceNum.toFixed(4)} USDT, need ${amountNum} USDT`
      );
      return;
    }

    setLoading(true);

    try {
      // Transfer USDT
      const transactionHash = await transferUSDT(
        paymentAddress,
        packageData.price.toString(),
        address
      );
      // const transactionHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      if (transactionHash) {
        // Verify payment with backend
        setVerifying(true);
        await verifyPayment(transactionHash);
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

  const verifyPayment = async (transactionHash) => {
    try {
      const response = await api.post("/payments/verify", {
        packageId: packageData._id,
        transactionHash,
      });

      if (response.data.success) {
        toast.success("Payment verified successfully!");
        await loadUSDTBalance();
        onSuccess?.();
        setIsModalOpen(false);
        onClose();
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      toast.error(error.response?.data?.message || "Failed to verify payment");
    }
  };

  if (!packageData) return null;

  const isCorrectNetwork = chainId === 56;

  const handleOpenChange = (isOpen) => {
    // Prevent closing when:
    // 1. Loading or verifying payment
    // 2. Wallet connection modal is open (Web3Modal might trigger this)
    // Only allow closing when user explicitly wants to (click Cancel or payment succeeds)
    if (!isOpen) {
      // If trying to close during loading/verifying, keep it open
      if (loading || verifying) {
        setIsModalOpen(true);
        return;
      }
      // Otherwise, allow closing (user clicked Cancel or outside)
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
          // Prevent closing with ESC during loading/verifying
          if (loading || verifying) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside during loading/verifying
          if (loading || verifying) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>Pay for {packageData.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Package Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Package Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-medium">{packageData.name}</span>
              </div>
              {packageData.description && (
                <div className="text-sm text-muted-foreground">{packageData.description}</div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{packageData.price} USDT</span>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wallet</CardTitle>
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
                  {parseFloat(usdtBalance) < parseFloat(packageData.price) && (
                    <Badge variant="destructive" className="text-xs">
                      Insufficient balance
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="font-mono text-sm break-all text-muted-foreground"
                title={paymentAddress}
              >
                {formatAddress(paymentAddress)}
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
              parseFloat(usdtBalance) < parseFloat(packageData.price)
            }
          >
            {verifying
              ? "Verifying..."
              : loading
              ? "Processing..."
              : `Pay ${packageData.price} USDT`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
