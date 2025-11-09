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
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
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

export default function AgentsPage() {
  return (
    <div className="container px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">AI Agents Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Monitor autonomous AI agents managing your bounty lifecycle
        </p>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Processed
            </CardTitle>
            <Activity className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.5%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Lightning fast</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div>
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.type}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={agent.status === "active" ? "default" : "secondary"}
                >
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {agent.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium">{agent.tasksCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">{agent.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Avg Processing Time
                  </span>
                  <span className="font-medium">{agent.avgTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="font-medium">{agent.lastActive}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Capabilities
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((capability) => (
                    <Badge
                      key={capability}
                      variant="outline"
                      className="text-xs"
                    >
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Activity</CardTitle>
          <CardDescription>Latest tasks processed by AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="reputation">Reputation</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Bounty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.agent}
                      </TableCell>
                      <TableCell>{activity.task}</TableCell>
                      <TableCell>{activity.bounty}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {activity.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="evaluations">
              <div className="text-center py-8 text-muted-foreground">
                Evaluation activities will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <div className="text-center py-8 text-muted-foreground">
                Payment activities will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="reputation">
              <div className="text-center py-8 text-muted-foreground">
                Reputation activities will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const agents = [
  {
    id: 1,
    name: "BountyCreationAgent",
    type: "Bounty Management",
    status: "active",
    description:
      "Autonomously creates and manages bounties based on project requirements",
    icon: <Bot className="w-6 h-6 text-primary" />,
    tasksCompleted: 342,
    successRate: 98,
    avgTime: "2.1s",
    lastActive: "2 min ago",
    capabilities: [
      "GitHub Integration",
      "Bounty Creation",
      "Requirement Analysis",
    ],
  },
  {
    id: 2,
    name: "CodeEvaluationAgent",
    type: "Code Review",
    status: "active",
    description:
      "Evaluates code submissions using multiple paid APIs and generates scores",
    icon: <CheckCircle2 className="w-6 h-6 text-secondary" />,
    tasksCompleted: 567,
    successRate: 95,
    avgTime: "4.5s",
    lastActive: "5 min ago",
    capabilities: [
      "Code Analysis",
      "Security Scan",
      "Test Coverage",
      "API Integration",
    ],
  },
  {
    id: 3,
    name: "PaymentAgent",
    type: "Payment Processing",
    status: "active",
    description:
      "Handles all payments via x402 protocol and multiple payment methods",
    icon: <DollarSign className="w-6 h-6 text-accent" />,
    tasksCompleted: 234,
    successRate: 99,
    avgTime: "0.8s",
    lastActive: "1 min ago",
    capabilities: [
      "x402 Protocol",
      "Phantom CASH",
      "Multi-Protocol",
      "Refunds",
    ],
  },
  {
    id: 4,
    name: "ReputationAgent",
    type: "Reputation Management",
    status: "active",
    description:
      "Manages on-chain reputation system and updates contributor scores",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    tasksCompleted: 189,
    successRate: 97,
    avgTime: "1.5s",
    lastActive: "3 min ago",
    capabilities: [
      "Reputation Calculation",
      "Fraud Detection",
      "On-chain Updates",
    ],
  },
  {
    id: 5,
    name: "MultiProtocolPaymentAgent",
    type: "Payment Protocol",
    status: "active",
    description:
      "Handles payments across multiple protocols with auto-conversion",
    icon: <Zap className="w-6 h-6 text-secondary" />,
    tasksCompleted: 156,
    successRate: 96,
    avgTime: "1.2s",
    lastActive: "4 min ago",
    capabilities: ["x402", "ATXP", "ACP/AP2", "Protocol Conversion"],
  },
  {
    id: 6,
    name: "CASHPaymentAgent",
    type: "CASH Integration",
    status: "active",
    description:
      "Processes payments using Phantom CASH for seamless transactions",
    icon: <DollarSign className="w-6 h-6 text-accent" />,
    tasksCompleted: 201,
    successRate: 98,
    avgTime: "0.9s",
    lastActive: "2 min ago",
    capabilities: ["Phantom CASH", "Smart Contracts", "CASH Refunds"],
  },
  {
    id: 7,
    name: "APIPaymentAgent",
    type: "API Management",
    status: "active",
    description:
      "Autonomously pays for APIs, LLM tokens, and data via HTTP-402",
    icon: <Activity className="w-6 h-6 text-primary" />,
    tasksCompleted: 423,
    successRate: 94,
    avgTime: "3.2s",
    lastActive: "1 min ago",
    capabilities: ["HTTP-402", "AgentPay", "Budget Management", "API Tracking"],
  },
  {
    id: 8,
    name: "CommunicationAgent",
    type: "Agent Coordination",
    status: "active",
    description:
      "Enables communication and coordination between different AI agents",
    icon: <Bot className="w-6 h-6 text-secondary" />,
    tasksCompleted: 892,
    successRate: 99,
    avgTime: "0.5s",
    lastActive: "30 sec ago",
    capabilities: [
      "Agent Messaging",
      "Task Coordination",
      "Conflict Resolution",
    ],
  },
];

const recentActivity = [
  {
    id: 1,
    agent: "CodeEvaluationAgent",
    task: "Code Review",
    bounty: "Implement OAuth2 Authentication",
    status: "completed",
    time: "2 min ago",
  },
  {
    id: 2,
    agent: "PaymentAgent",
    task: "Process Payment",
    bounty: "Design Mobile UI Components",
    status: "completed",
    time: "5 min ago",
  },
  {
    id: 3,
    agent: "ReputationAgent",
    task: "Update Reputation",
    bounty: "Optimize Database Queries",
    status: "completed",
    time: "8 min ago",
  },
  {
    id: 4,
    agent: "BountyCreationAgent",
    task: "Create Bounty",
    bounty: "Add WebSocket Support",
    status: "processing",
    time: "10 min ago",
  },
  {
    id: 5,
    agent: "APIPaymentAgent",
    task: "Pay for API",
    bounty: "Security Audit Required",
    status: "completed",
    time: "15 min ago",
  },
];
