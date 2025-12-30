import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { config, projectId } from "./config/wagmi.config";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

// Create Web3Modal instance
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeMode: "light",
  themeVariables: {
    "--w3m-z-index": "9999",
  },
  // Enable wallet features
  enableWalletFeatures: true,
  // Enable account view
  enableAccountView: true,
  // Enable network view
  enableNetworkView: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
