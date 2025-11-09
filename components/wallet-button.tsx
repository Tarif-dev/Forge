"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut, Wallet } from "lucide-react";

export function WalletButton() {
  const { publicKey, disconnect, connected, select, wallets, wallet, connect } =
    useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (wallet && !connected) {
      console.log(
        "Wallet selected, attempting to connect:",
        wallet.adapter.name
      );
      connect().catch((error) => {
        console.error("Connection error:", error);
      });
    }
  }, [wallet, connected, connect]);

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleConnect = () => {
    setVisible(true);
  };

  if (!mounted) {
    return <Button disabled>Loading...</Button>;
  }

  if (!connected || !publicKey) {
    return (
      <Button onClick={handleConnect} className="gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  const base58 = publicKey.toString();
  const truncated = `${base58.slice(0, 4)}...${base58.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="w-4 h-4" />
          {truncated}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConnect} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          Change Wallet
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
