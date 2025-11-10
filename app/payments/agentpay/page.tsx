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
import { DollarSign, Activity, Brain, Database, Code } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AgentPayment {
  id: string;
  agentId: string;
  paymentType: string;
  provider: string;
  endpoint: string | null;
  amount: number;
  status: string;
  metadata: any;
  createdAt: string;
}

interface PaymentStats {
  total: number;
  volume: number;
  apiCalls: number;
  llmTokens: number;
  dataAccess: number;
  avgCost: number;
}

export default function AgentPayPage() {
  const [payments, setPayments] = useState<AgentPayment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    volume: 0,
    apiCalls: 0,
    llmTokens: 0,
    dataAccess: 0,
    avgCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchPayments();
    // Real-time updates every 5 seconds
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/agentpay/pay");
      const data = await response.json();

      if (data.payments && Array.isArray(data.payments)) {
        setPayments(data.payments);
        setStats(data.stats || calculateStats(data.payments));
      }
    } catch (error) {
      console.error("Error fetching AgentPay payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (payments: AgentPayment[]): PaymentStats => {
    return {
      total: payments.length,
      volume: payments.reduce((sum, p) => sum + p.amount, 0),
      apiCalls: payments.filter((p) => p.paymentType === "API").length,
      llmTokens: payments.filter((p) => p.paymentType === "LLM_TOKENS").length,
      dataAccess: payments.filter((p) => p.paymentType === "DATA_ACCESS")
        .length,
      avgCost:
        payments.length > 0
          ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length
          : 0,
    };
  };

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p) => p.paymentType === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "API":
        return <Code className="w-4 h-4 text-blue-600" />;
      case "LLM_TOKENS":
        return <Brain className="w-4 h-4 text-purple-600" />;
      case "DATA_ACCESS":
        return <Database className="w-4 h-4 text-green-600" />;
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
          <DollarSign className="w-10 h-10 text-accent" />
          <div>
            <h1 className="text-4xl font-bold">AgentPay Micropayments</h1>
            <p className="text-lg text-muted-foreground">
              Autonomous AI agents paying for APIs, LLM tokens, and data access
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
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.volume.toFixed(4)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Code className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apiCalls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.llmTokens} LLM • {stats.dataAccess} Data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.avgCost.toFixed(6)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle>💡 How AgentPay Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <div className="font-semibold">Agent Needs Resources</div>
              <p className="text-sm text-muted-foreground">
                AI agent requires API access, LLM tokens, or data to complete
                evaluation tasks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <div className="font-semibold">HTTP-402 Payment Request</div>
              <p className="text-sm text-muted-foreground">
                Service returns HTTP 402 status with payment details and wallet
                address
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <div className="font-semibold">Autonomous Micropayment</div>
              <p className="text-sm text-muted-foreground">
                Agent autonomously pays exact amount needed on Solana, receives
                access instantly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            filter === "API"
              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
              : ""
          }`}
          onClick={() => setFilter(filter === "API" ? "all" : "API")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Code className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apiCalls}</div>
            <p className="text-xs text-muted-foreground">
              REST APIs, GraphQL, WebSockets
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            filter === "LLM_TOKENS"
              ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
              : ""
          }`}
          onClick={() =>
            setFilter(filter === "LLM_TOKENS" ? "all" : "LLM_TOKENS")
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Tokens</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.llmTokens}</div>
            <p className="text-xs text-muted-foreground">
              GPT-4, Claude, Gemini
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            filter === "DATA_ACCESS"
              ? "border-green-600 bg-green-50 dark:bg-green-950/20"
              : ""
          }`}
          onClick={() =>
            setFilter(filter === "DATA_ACCESS" ? "all" : "DATA_ACCESS")
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Access</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dataAccess}</div>
            <p className="text-xs text-muted-foreground">
              Databases, File Storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            All micropayments made by AI agents
            {filter !== "all" && (
              <Badge variant="outline" className="ml-2">
                Filtered by {filter.replace("_", " ")}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(payment.paymentType)}
                          <Badge variant="outline" className="text-xs">
                            {payment.paymentType.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.agentId.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.provider}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {payment.endpoint || "-"}
                      </TableCell>
                      <TableCell className="font-semibold text-xs">
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
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTime(payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cost Optimization Tips */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle>💰 Cost Optimization</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-2">🎯 Smart Caching</div>
            <p className="text-muted-foreground">
              Agents automatically cache API responses to minimize redundant
              calls
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">📊 Budget Management</div>
            <p className="text-muted-foreground">
              Set spending limits per agent to prevent unexpected costs
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">⚡ Batch Processing</div>
            <p className="text-muted-foreground">
              Group multiple requests together to reduce per-transaction fees
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
