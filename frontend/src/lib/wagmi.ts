import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "EOLAS — AI Prediction Intelligence",
  projectId: "5b29430ba630bcc05c543815b77391ea",
  chains: [base, mainnet],
  ssr: true,
});
