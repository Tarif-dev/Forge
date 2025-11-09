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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Zap,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  amount: number;
  tokenMint: string;
  transactionHash: string | null;
  protocol: string;
  status: string;
  createdAt: string;
  payer: {
    username: string | null;
    walletAddress: string;
  };
  receiver: {
    username: string | null;
    walletAddress: string;
  };
  application?: {
    bounty: {
      title: string;
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalVolume: payments.reduce((sum, p) => sum + p.amount, 0),
    totalTransactions: payments.length,
    successRate:
      payments.length > 0
        ? (
            (payments.filter((p) => p.status === "COMPLETED").length /
              payments.length) *
            100
          ).toFixed(1)
        : "0",
    protocols: [...new Set(payments.map((p) => p.protocol))].length,
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const filteredPayments =
    selectedTab === "all"
      ? payments
      : payments.filter((p) => p.protocol === selectedTab);

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Payment Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Track payments across Solana blockchain powered by AI agents
        </p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalVolume.toLocaleString()}
            </div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" /> Real-time tracking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Excellent performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Protocols
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.protocols}</div>
            <p className="text-xs text-muted-foreground">
              Multi-protocol support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Real-time payment transactions on Solana devnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="SOL">SOL</TabsTrigger>
              <TabsTrigger value="USDC">USDC</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading payments...
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bounty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.payer.username ||
                              payment.payer.walletAddress.slice(0, 8) + "..."}
                          </TableCell>
                          <TableCell>
                            {payment.receiver.username ||
                              payment.receiver.walletAddress.slice(0, 8) +
                                "..."}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                              <span className="font-medium">
                                ${payment.amount}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {payment.protocol}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {payment.application?.bounty.title || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "COMPLETED"
                                  ? "default"
                                  : payment.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.transactionHash ? (
                              <a
                                href={`https://explorer.solana.com/tx/${payment.transactionHash}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                View
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(payment.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
