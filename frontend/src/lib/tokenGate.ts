"use client";
import { useAccount, useReadContract } from "wagmi";
import { base } from "wagmi/chains";

export const EOLAS_CA = "0xF878e27aFB649744EEC3c5c0d03bc9335703CFE3";
export const EOLAS_BUY_LINK = "https://og.creator.bid/agents/67386d539ae05044ee676a5e";
export const MINIMUM_TOKENS = 10000;

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

export function useTokenGate() {
  const { address, isConnected } = useAccount();

  const { data: rawBalance, isLoading: balanceLoading } = useReadContract({
    address: EOLAS_CA as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address },
  });

  const { data: decimals, isLoading: decimalsLoading } = useReadContract({
    address: EOLAS_CA as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: base.id,
  });

  const dec = typeof decimals === "number" ? decimals : 18;
  const balance = rawBalance ? Number(rawBalance) / Math.pow(10, dec) : 0;
  const hasAccess = balance >= MINIMUM_TOKENS;
  const isLoading = isConnected && (balanceLoading || decimalsLoading);

  return {
    isConnected,
    address,
    balance,
    hasAccess,
    isLoading,
  };
}
