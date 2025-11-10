"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, TrendingDown, Activity, Wallet, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface CASHTransaction {
  id: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  fee: number;
  signature: string;
  status: string;
  bountyId: string | null;
  memo: string | null;
  createdAt: string;
}

export default function CASHPaymentsPage() {
  const [transactions, setTransactions] = useState<CASHTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { toast } = useToast();

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    toWallet: "",
    amount: "",
    memo: "",
  });

  useEffect(() => {
    fetchTransactions();
    // Real-time updates every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/payments/cash/process");
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching CASH transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const response = await fetch("/api/payments/cash/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromWallet: "YOUR_WALLET_ADDRESS", // Would come from connected wallet
          toWallet: paymentForm.toWallet,
          amount: parseFloat(paymentForm.amount),
          memo: paymentForm.memo || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Payment Successful!",
          description: `Sent $${paymentForm.amount} via CASH`,
        });
        setPaymentForm({ toWallet: "", amount: "", memo: "" });
        fetchTransactions();
      } else {
        toast({
          title: "Payment Failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const stats = {
    total: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions.reduce((sum, t) => sum + t.fee, 0),
    avgFee:
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.fee, 0) / transactions.length
        : 0,
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="w-10 h-10 text-secondary" />
          <div>
            <h1 className="text-4xl font-bold">Phantom CASH Payments</h1>
            <p className="text-lg text-muted-foreground">
              Ultra-low fees and seamless payment experience
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Wallet className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalVolume.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgFee.toFixed(6)}</div>
            <p className="text-xs text-muted-foreground">
              Only 0.05% per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fees Paid
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalFees.toFixed(6)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle>Send CASH Payment</CardTitle>
          <CardDescription>
            Lightning-fast payments with minimal fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toWallet">Recipient Wallet Address</Label>
                <Input
                  id="toWallet"
                  placeholder="Enter Solana address"
                  value={paymentForm.toWallet}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, toWallet: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Input
                id="memo"
                placeholder="Payment note"
                value={paymentForm.memo}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, memo: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Estimated fee: $
                {paymentForm.amount
                  ? (parseFloat(paymentForm.amount) * 0.0005).toFixed(6)
                  : "0.000000"}
              </div>
              <Button type="submit" disabled={paymentLoading}>
                <Send className="w-4 h-4 mr-2" />
                {paymentLoading ? "Processing..." : "Send Payment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Why CASH */}
      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle>⚡ Why Phantom CASH?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-2">💰 Ultra-Low Fees</div>
            <p className="text-muted-foreground">
              Only 0.05% per transaction—up to 10x cheaper than traditional
              payment processors
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">🚀 Lightning Fast</div>
            <p className="text-muted-foreground">
              Instant settlement on Solana blockchain—no waiting for bank
              transfers
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">🔒 Secure & Transparent</div>
            <p className="text-muted-foreground">
              Phantom wallet integration ensures safe, verifiable transactions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All CASH payments on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Memo</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No CASH transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">
                        {tx.fromWallet.slice(0, 8)}...{tx.fromWallet.slice(-4)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.toWallet.slice(0, 8)}...{tx.toWallet.slice(-4)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-green-600 text-xs">
                        ${tx.fee.toFixed(6)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "SUCCESS" ? "default" : "secondary"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[150px] truncate">
                        {tx.memo || "-"}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:underline text-xs font-mono"
                        >
                          {tx.signature.slice(0, 8)}...
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTime(tx.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
