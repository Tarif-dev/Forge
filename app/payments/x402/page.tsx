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
import {
  Bot,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Zap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface X402Transaction {
  id: string;
  fromAgent: string;
  toAgent: string;
  amount: number;
  signature: string;
  status: string;
  autonomous: boolean;
  bountyId: string | null;
  metadata: any;
  createdAt: string;
}

export default function X402PaymentsPage() {
  const [transactions, setTransactions] = useState<X402Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "autonomous" | "manual">("all");

  useEffect(() => {
    fetchTransactions();
    // Real-time updates every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === "autonomous") params.append("autonomous", "true");
      if (filter === "manual") params.append("autonomous", "false");

      const response = await fetch(`/api/payments/x402/process?${params}`);
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching x402 transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions;

  const stats = {
    total: transactions.length,
    autonomous: transactions.filter((t) => t.autonomous).length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    successRate:
      transactions.length > 0
        ? (transactions.filter((t) => t.status === "SUCCESS").length /
            transactions.length) *
          100
        : 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
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
          <Bot className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">x402 Autonomous Payments</h1>
            <p className="text-lg text-muted-foreground">
              Agent-to-agent payments with autonomous decision making
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autonomous</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.autonomous}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? ((stats.autonomous / stats.total) * 100).toFixed(0)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalVolume.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.successRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>🚀 How x402 Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <div className="font-semibold">AI Agent Evaluates Work</div>
              <p className="text-sm text-muted-foreground">
                Agent autonomously scores code submissions using LLM analysis
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <div className="font-semibold">Autonomous Payment Decision</div>
              <p className="text-sm text-muted-foreground">
                If score ≥ 70, agent automatically initiates payment—no human
                approval needed
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <div className="font-semibold">On-Chain Settlement</div>
              <p className="text-sm text-muted-foreground">
                Payment is processed on Solana and verified transparently
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Real-time tracking of all x402 payments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "autonomous" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("autonomous")}
              >
                <Bot className="w-4 h-4 mr-1" />
                Autonomous
              </Button>
              <Button
                variant={filter === "manual" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("manual")}
              >
                Manual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>From Agent</TableHead>
                  <TableHead>To Agent</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bounty</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          <Badge
                            variant={
                              tx.status === "SUCCESS"
                                ? "default"
                                : tx.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.fromAgent.slice(0, 8)}...{tx.fromAgent.slice(-4)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.toAgent.slice(0, 8)}...{tx.toAgent.slice(-4)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {tx.autonomous ? (
                          <Badge variant="outline" className="text-xs">
                            <Bot className="w-3 h-3 mr-1" />
                            Autonomous
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Manual
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {tx.bountyId ? (
                          <a
                            href={`/bounties`}
                            className="text-primary hover:underline text-xs"
                          >
                            View Bounty
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs font-mono"
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
