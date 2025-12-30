import { useAccount, useBalance, useDisconnect, useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletConnect() {
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { data: balanceData } = useBalance({
    address: address,
    enabled: !!address,
  });
  const { open } = useWeb3Modal();

  const handleConnect = async () => {
    try {
      // If already connected but to wrong network, disconnect first
      if (isConnected && chainId !== 56) {
        await disconnect();
        // Wait a bit before opening new connection
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Check if MetaMask is available and try direct connection first
      let isMetaMaskInstalled = false;
      try {
        if (typeof window !== "undefined" && window.ethereum) {
          // Safely check for MetaMask - avoid accessing private fields
          const ethereum = window.ethereum;
          isMetaMaskInstalled = !!(
            ethereum.isMetaMask ||
            (ethereum.providers &&
              Array.isArray(ethereum.providers) &&
              ethereum.providers.some((p) => p && p.isMetaMask))
          );
        }
      } catch (e) {
        // Ignore errors when checking MetaMask - just use Web3Modal
        console.log("MetaMask check error, using Web3Modal:", e);
      }

      const metaMaskConnector = connectors.find(
        (c) => c.id === "metaMask" || c.id === "io.metamask"
      );

      if (isMetaMaskInstalled && metaMaskConnector) {
        try {
          // Try direct MetaMask connection first
          await connect({ connector: metaMaskConnector });
          return;
        } catch (metaMaskError) {
          console.log("Direct MetaMask connection failed, trying Web3Modal:", metaMaskError);
          // Fall through to Web3Modal
        }
      }

      // Use Web3Modal for other wallets or if MetaMask direct connection failed
      await open();
    } catch (error) {
      console.error("Connect error:", error);
      // If error is about pending request, try to disconnect and reconnect
      if (
        error?.message?.includes("declined") ||
        error?.message?.includes("pending") ||
        error?.message?.includes("rejected")
      ) {
        try {
          // Disconnect any existing connection
          if (isConnected) {
            await disconnect();
          }
          // Wait a bit for cleanup
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Try again with Web3Modal
          await open();
        } catch (retryError) {
          console.error("Retry connect error:", retryError);
        }
      }
    }
  };

  const isCorrectNetwork = chainId === 56;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {!isCorrectNetwork && <Badge variant="destructive">Wrong Network</Badge>}
        <div className="text-right">
          <p className="text-sm font-medium">
            {/* {address.slice(0, 6)}...{address.slice(-4)} */}
            {address}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
