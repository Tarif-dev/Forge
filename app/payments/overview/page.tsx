"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, Bot, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentStats {
  x402: {
    total: number;
    autonomous: number;
    volume: number;
  };
  cash: {
    total: number;
    volume: number;
    avgFee: number;
  };
  agentpay: {
    total: number;
    volume: number;
    apiCalls: number;
  };
}

export default function PaymentsOverviewPage() {
  const [x402Transactions, setX402Transactions] = useState<any[]>([]);
  const [cashTransactions, setCashTransactions] = useState<any[]>([]);
  const [agentPayments, setAgentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("x402");

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);

      // Fetch x402 transactions
      const x402Response = await fetch("/api/payments/x402/process");
      const x402Data = await x402Response.json();
      setX402Transactions(Array.isArray(x402Data) ? x402Data : []);

      // Fetch CASH transactions
      const cashResponse = await fetch("/api/payments/cash/process");
      const cashData = await cashResponse.json();
      setCashTransactions(Array.isArray(cashData) ? cashData : []);

      // Fetch AgentPay payments
      const agentpayResponse = await fetch("/api/agentpay/pay");
      const agentpayData = await agentpayResponse.json();
      setAgentPayments(
        Array.isArray(agentpayData.payments) ? agentpayData.payments : []
      );
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats: PaymentStats = {
    x402: {
      total: x402Transactions.length,
      autonomous: x402Transactions.filter((t) => t.autonomous).length,
      volume: x402Transactions.reduce((sum, t) => sum + t.amount, 0),
    },
    cash: {
      total: cashTransactions.length,
      volume: cashTransactions.reduce((sum, t) => sum + t.amount, 0),
      avgFee:
        cashTransactions.length > 0
          ? cashTransactions.reduce((sum, t) => sum + (t.fee || 0), 0) /
            cashTransactions.length
          : 0,
    },
    agentpay: {
      total: agentPayments.length,
      volume: agentPayments.reduce((sum, p) => sum + p.amount, 0),
      apiCalls: agentPayments.filter((p) => p.paymentType === "API").length,
    },
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

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Payment Methods Overview</h1>
        <p className="text-lg text-muted-foreground">
          Three cutting-edge payment systems integrated into one platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              x402 Autonomous
            </CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.x402.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.x402.autonomous} autonomous • $
              {stats.x402.volume.toFixed(2)} volume
            </p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phantom CASH</CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cash.total}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.cash.volume.toFixed(2)} volume • $
              {stats.cash.avgFee.toFixed(4)} avg fee
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AgentPay</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agentpay.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.agentpay.apiCalls} API calls • $
              {stats.agentpay.volume.toFixed(4)} spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            Real-time tracking across all payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="x402">
                <Bot className="w-4 h-4 mr-2" />
                x402 Autonomous
              </TabsTrigger>
              <TabsTrigger value="cash">
                <Zap className="w-4 h-4 mr-2" />
                Phantom CASH
              </TabsTrigger>
              <TabsTrigger value="agentpay">
                <DollarSign className="w-4 h-4 mr-2" />
                AgentPay
              </TabsTrigger>
            </TabsList>

            {/* x402 Tab */}
            <TabsContent value="x402" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Agent</TableHead>
                      <TableHead>To Agent</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {x402Transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No x402 transactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      x402Transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">
                            {tx.fromAgent.slice(0, 8)}...
                            {tx.fromAgent.slice(-4)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {tx.toAgent.slice(0, 8)}...{tx.toAgent.slice(-4)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                              <span className="font-medium">${tx.amount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tx.status === "SUCCESS"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {tx.autonomous && (
                              <Badge variant="outline" className="text-xs">
                                <Bot className="w-3 h-3 mr-1" />
                                Autonomous
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(tx.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* CASH Tab */}
            <TabsContent value="cash" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Wallet</TableHead>
                      <TableHead>To Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No CASH transactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      cashTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">
                            {tx.fromWallet.slice(0, 8)}...
                            {tx.fromWallet.slice(-4)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {tx.toWallet.slice(0, 8)}...{tx.toWallet.slice(-4)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-secondary" />
                              <span className="font-medium">${tx.amount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            ${tx.fee.toFixed(6)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tx.status === "SUCCESS"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(tx.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* AgentPay Tab */}
            <TabsContent value="agentpay" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No AgentPay payments yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      agentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-xs">
                            {payment.agentId.slice(0, 12)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {payment.paymentType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {payment.provider}
                          </TableCell>
                          <TableCell className="text-xs">
                            ${payment.amount.toFixed(6)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "SUCCESS"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
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

      {/* Innovation Highlight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Payment Innovation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">🤖 x402 Autonomous</div>
              <p className="text-muted-foreground">
                AI agents make payment decisions based on evaluation scores—no
                human intervention needed
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">⚡ Phantom CASH</div>
              <p className="text-muted-foreground">
                Seamless, low-fee payments optimized for speed and user
                experience
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">💰 AgentPay</div>
              <p className="text-muted-foreground">
                Agents autonomously pay for APIs and LLM tokens via HTTP-402
                micropayments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
