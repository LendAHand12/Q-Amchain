import { writeContract, waitForTransactionReceipt, readContract } from "wagmi/actions";
import { parseUnits, formatUnits } from "viem";
import { config } from "../config/wagmi.config";
import BEP20USDT_ABI from "@/abis/BEP20USDT.json";
import toast from "react-hot-toast";

const USDT_ADDRESS = (import.meta.env.VITE_TOKEN_ADDRESS ||
  "0x55d398326f99059fF775485246999027B3197955") as `0x${string}`;

/**
 * Get USDT balance of an address
 */
export const getUSDTBalance = async (address: `0x${string}`): Promise<string> => {
  try {
    const balance = await readContract(config, {
      address: USDT_ADDRESS,
      abi: BEP20USDT_ABI as any,
      functionName: "balanceOf",
      args: [address],
    });

    // USDT has 18 decimals
    return formatUnits(balance as bigint, 18);
  } catch (error) {
    console.error("Get USDT balance error:", error);
    throw error;
  }
};

/**
 * Transfer USDT tokens
 * @param toAddress - Recipient address
 * @param amount - Amount in USDT (string)
 * @param fromAddress - Sender address (must be connected)
 * @returns Transaction hash
 */
export const transferUSDT = async (
  toAddress: string,
  amount: string,
  fromAddress: `0x${string}`
): Promise<`0x${string}`> => {
  if (!fromAddress) {
    throw new Error("Please connect your wallet first");
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
    throw new Error("Invalid recipient address format");
  }

  try {
    // Convert amount to wei (USDT has 18 decimals)
    const amountInWei = parseUnits(amount, 18);

    // Send transaction - add account to ensure proper chain ID resolution
    const hash = await writeContract(config, {
      account: fromAddress,
      address: USDT_ADDRESS,
      abi: BEP20USDT_ABI as any,
      functionName: "transfer",
      args: [toAddress.toLowerCase() as `0x${string}`, amountInWei],
      chainId: 56, // Explicitly set BSC chain ID
    });

    toast.success("Transaction submitted! Waiting for confirmation...");

    // Wait for transaction receipt
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      timeout: 60_000, // 60 seconds
    });

    if (receipt.status === "success") {
      toast.success("Payment successful!");
      return receipt.transactionHash;
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Transfer USDT error:", error);
    const errorMessage = error?.message || "Payment failed";

    if (
      errorMessage.includes("User rejected") ||
      errorMessage.includes("denied") ||
      errorMessage.includes("rejected")
    ) {
      toast.error("Transaction rejected by user");
      throw new Error("Transaction rejected");
    }

    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Check if address is valid
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
