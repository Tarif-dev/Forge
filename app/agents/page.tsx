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

interface AgentActivity {
  id: string;
  agentType: string;
  action: string;
  description: string;
  metadata: any;
  createdAt: string;
}

interface AgentStats {
  agentType: string;
  _count: number;
}

export default function AgentsPage() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [stats, setStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, [selectedTab]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTab !== "all") {
        params.append("agentType", selectedTab);
      }

      const response = await fetch(
        `/api/agents/activities?${params.toString()}`
      );
      const data = await response.json();
      setActivities(data.activities || []);
      setStats(data.stats || []);
    } catch (error) {
      console.error("Error fetching agent activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalActivities = stats.reduce((sum, s) => sum + s._count, 0);
  const agentTypes = stats.length;

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
            <div className="text-2xl font-bold">{agentTypes}</div>
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
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">Real-time tracking</p>
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
              Latest Activity
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.length > 0
                ? formatTime(activities[0].createdAt)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Last update</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Stats by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Activity Statistics</CardTitle>
          <CardDescription>Tasks completed by each agent type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.agentType}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {stat.agentType === "EVALUATION" && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                    {stat.agentType === "PAYMENT" && (
                      <DollarSign className="w-5 h-5 text-secondary" />
                    )}
                    {stat.agentType === "REPUTATION" && (
                      <TrendingUp className="w-5 h-5 text-accent" />
                    )}
                    {stat.agentType === "BOUNTY_CREATION" && (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                    {![
                      "EVALUATION",
                      "PAYMENT",
                      "REPUTATION",
                      "BOUNTY_CREATION",
                    ].includes(stat.agentType) && (
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{stat.agentType}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
                <Badge variant="outline">{stat._count} tasks</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Agent Activity</CardTitle>
          <CardDescription>Live feed of AI agent operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="EVALUATION">Evaluations</TabsTrigger>
              <TabsTrigger value="PAYMENT">Payments</TabsTrigger>
              <TabsTrigger value="REPUTATION">Reputation</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading activities...
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No activities found
                        </TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">
                              {activity.agentType}
                            </Badge>
                          </TableCell>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {activity.description}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(activity.createdAt)}
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
