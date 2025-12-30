import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { metaMask, walletConnect, injected } from "wagmi/connectors";

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "Q-Amchain",
  description: "Q-Amchain Validator Packages",
  url: import.meta.env.VITE_FRONTEND_URL,
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [bsc];
const connectors = [
  metaMask(),
  walletConnect({ projectId, chains, metadata }),
  injected({ chains }),
];

export const config = createConfig({
  chains,
  connectors,
  transports: {
    [bsc.id]: http(),
  },
});
