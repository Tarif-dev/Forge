"use client";

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
  ArrowDownRight,
  Wallet,
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

export default function PaymentsPage() {
  return (
    <div className="container px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Payment Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Track payments across multiple protocols powered by x402
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
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" /> +22% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <p className="text-xs text-muted-foreground">+18% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
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
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Multi-protocol support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {protocols.map((protocol) => (
          <Card
            key={protocol.name}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-lg">{protocol.name}</CardTitle>
              <CardDescription>{protocol.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{protocol.volume}</div>
              <div className="text-xs text-muted-foreground">
                {protocol.transactions} transactions
              </div>
              <Badge variant="outline" className="text-xs">
                {protocol.percentage}% of total
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest payment transactions across all protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="x402">x402</TabsTrigger>
              <TabsTrigger value="cash">CASH</TabsTrigger>
              <TabsTrigger value="atxp">ATXP</TabsTrigger>
              <TabsTrigger value="acp">ACP/AP2</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Bounty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">
                        {tx.hash}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "outgoing" ? (
                            <ArrowUpRight className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-green-500" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.protocol}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {tx.bounty}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "default"
                              : tx.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="x402">
              <div className="text-center py-8 text-muted-foreground">
                x402 protocol transactions will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="cash">
              <div className="text-center py-8 text-muted-foreground">
                Phantom CASH transactions will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="atxp">
              <div className="text-center py-8 text-muted-foreground">
                ATXP protocol transactions will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="acp">
              <div className="text-center py-8 text-muted-foreground">
                ACP/AP2 protocol transactions will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Recipients</CardTitle>
            <CardDescription>
              Contributors with highest earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecipients.map((recipient, index) => (
                <div
                  key={recipient.address}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {recipient.address}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{recipient.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {recipient.transactions} txs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment protocol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <div key={protocol.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{protocol.name}</span>
                    <span className="text-muted-foreground">
                      {protocol.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${protocol.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const protocols = [
  {
    name: "x402",
    description: "HTTP-402 Protocol",
    volume: "$1.2M",
    transactions: 1423,
    percentage: 48,
  },
  {
    name: "CASH",
    description: "Phantom CASH",
    volume: "$687K",
    transactions: 892,
    percentage: 28,
  },
  {
    name: "ATXP",
    description: "ATXP Protocol",
    volume: "$342K",
    transactions: 534,
    percentage: 14,
  },
  {
    name: "ACP",
    description: "ACP Protocol",
    volume: "$156K",
    transactions: 287,
    percentage: 7,
  },
  {
    name: "AP2",
    description: "AP2 Protocol",
    volume: "$78K",
    transactions: 111,
    percentage: 3,
  },
];

const transactions = [
  {
    id: 1,
    hash: "0x7a8b9c...def456",
    type: "outgoing",
    protocol: "x402",
    bounty: "Implement OAuth2 Authentication",
    amount: "500 USDC",
    status: "completed",
    time: "2 min ago",
  },
  {
    id: 2,
    hash: "0x3f4e5d...abc123",
    type: "outgoing",
    protocol: "CASH",
    bounty: "Design Mobile UI Components",
    amount: "750 USDC",
    status: "completed",
    time: "15 min ago",
  },
  {
    id: 3,
    hash: "0x1a2b3c...xyz789",
    type: "outgoing",
    protocol: "ATXP",
    bounty: "Optimize Database Queries",
    amount: "400 USDC",
    status: "pending",
    time: "32 min ago",
  },
  {
    id: 4,
    hash: "0x9d8e7f...ghi012",
    type: "incoming",
    protocol: "x402",
    bounty: "Smart Contract Audit",
    amount: "2000 USDC",
    status: "completed",
    time: "1 hour ago",
  },
  {
    id: 5,
    hash: "0x6c5d4e...jkl345",
    type: "outgoing",
    protocol: "ACP",
    bounty: "API Integration",
    amount: "325 USDC",
    status: "completed",
    time: "2 hours ago",
  },
  {
    id: 6,
    hash: "0x4b3a2c...mno678",
    type: "outgoing",
    protocol: "CASH",
    bounty: "UI/UX Redesign",
    amount: "850 USDC",
    status: "completed",
    time: "3 hours ago",
  },
];

const topRecipients = [
  {
    name: "Alice.dev",
    address: "7a8b9c...def456",
    amount: "$12,340",
    transactions: 23,
  },
  {
    name: "Bob.eth",
    address: "3f4e5d...abc123",
    amount: "$9,850",
    transactions: 18,
  },
  {
    name: "Charlie.sol",
    address: "1a2b3c...xyz789",
    amount: "$8,200",
    transactions: 15,
  },
  {
    name: "Diana.crypto",
    address: "9d8e7f...ghi012",
    amount: "$7,650",
    transactions: 14,
  },
  {
    name: "Eve.blockchain",
    address: "6c5d4e...jkl345",
    amount: "$6,420",
    transactions: 12,
  },
];
