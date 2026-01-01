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
    // Early return if already processing to prevent duplicate requests
    if (loading || verifying) {
      return;
    }

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

    // Set loading state immediately to prevent duplicate clicks
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
        setLoading(false); // Stop loading, start verifying
        setVerifying(true);
        await verifyPayment(transactionHash);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error?.message) {
        toast.error(error.message);
      }
      setLoading(false);
      setVerifying(false);
    }
  };

  const verifyPayment = async (transactionHash) => {
    // Early return if not verifying (shouldn't happen, but safety check)
    if (!verifying) {
      return;
    }

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
    } finally {
      setVerifying(false);
      setLoading(false);
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
        className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6"
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
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Payment</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Pay for {packageData.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 mt-4">
          {/* Package Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Package Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground text-sm sm:text-base">Package:</span>
                <span className="font-medium text-sm sm:text-base text-right break-words">
                  {packageData.name}
                </span>
              </div>
              {packageData.description && (
                <div className="text-xs sm:text-sm text-muted-foreground break-words">
                  {packageData.description}
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                <span>Total:</span>
                <span className="break-words">{packageData.price} USDT</span>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Connection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="w-full">
                <WalletConnect />
              </div>
              {!isCorrectNetwork && isConnected && (
                <Badge variant="destructive" className="text-xs sm:text-sm w-full justify-center">
                  Please switch to BSC Mainnet
                </Badge>
              )}
              {isConnected && address && (
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">USDT Balance:</span>
                    <span className="font-medium break-words text-right">
                      {parseFloat(usdtBalance).toFixed(4)} USDT
                    </span>
                  </div>
                  {parseFloat(usdtBalance) < parseFloat(packageData.price) && (
                    <Badge variant="destructive" className="text-xs w-full justify-center mt-1">
                      Insufficient balance
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Payment Address</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="font-mono text-xs sm:text-sm break-all text-muted-foreground word-break break-words"
                title={paymentAddress}
              >
                {formatAddress(paymentAddress)}
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || verifying}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
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
            className="w-full sm:w-auto order-1 sm:order-2"
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
