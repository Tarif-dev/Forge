"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  GitPullRequest,
} from "lucide-react";

export default function BountiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="container px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Bounty Marketplace</h1>
        <p className="text-lg text-muted-foreground">
          Discover and claim bounties managed by autonomous AI agents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bounties</CardTitle>
            <GitPullRequest className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$524K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Contributors
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Completion
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2d</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bounties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Reward</SelectItem>
            <SelectItem value="lowest">Lowest Reward</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Bounties</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {bounties.map((bounty) => (
              <Card
                key={bounty.id}
                className="hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            bounty.status === "open" ? "default" : "secondary"
                          }
                        >
                          {bounty.status}
                        </Badge>
                        {bounty.aiManaged && (
                          <Badge variant="outline" className="gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                            </svg>
                            AI Managed
                          </Badge>
                        )}
                        <Badge variant="outline">{bounty.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-2xl">{bounty.title}</CardTitle>
                      <CardDescription className="text-base">
                        {bounty.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {bounty.reward}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bounty.protocol}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {bounty.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {bounty.applicants} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {bounty.postedAt}
                        </span>
                        <span>by {bounty.creator}</span>
                      </div>
                      <Button>View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="frontend">
          <div className="text-center py-12 text-muted-foreground">
            Frontend bounties will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="backend">
          <div className="text-center py-12 text-muted-foreground">
            Backend bounties will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="smart-contracts">
          <div className="text-center py-12 text-muted-foreground">
            Smart contract bounties will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="design">
          <div className="text-center py-12 text-muted-foreground">
            Design bounties will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const bounties = [
  {
    id: 1,
    title: "Implement x402 Payment Gateway Integration",
    description:
      "Integrate x402 protocol for autonomous payment processing in the bounty system. Must support multiple payment protocols and handle edge cases.",
    reward: "1,200 USDC",
    protocol: "x402",
    status: "open",
    difficulty: "Advanced",
    tags: ["Solana", "x402", "TypeScript", "Smart Contracts"],
    creator: "DevQuest DAO",
    applicants: 23,
    postedAt: "2 days ago",
    aiManaged: true,
  },
  {
    id: 2,
    title: "AI Agent Dashboard UI Design",
    description:
      "Create a modern, responsive dashboard for monitoring AI agent activities. Should include real-time updates and data visualizations.",
    reward: "850 USDC",
    protocol: "CASH",
    status: "open",
    difficulty: "Intermediate",
    tags: ["React", "UI/UX", "Next.js", "Tailwind CSS"],
    creator: "ProjectAlpha",
    applicants: 15,
    postedAt: "1 day ago",
    aiManaged: true,
  },
  {
    id: 3,
    title: "Optimize Smart Contract Gas Usage",
    description:
      "Review and optimize existing Solana smart contracts to reduce transaction costs and improve performance.",
    reward: "2,000 USDC",
    protocol: "x402",
    status: "open",
    difficulty: "Expert",
    tags: ["Rust", "Anchor", "Solana", "Smart Contracts"],
    creator: "TechDAO",
    applicants: 8,
    postedAt: "4 hours ago",
    aiManaged: true,
  },
  {
    id: 4,
    title: "Build Reputation System Backend API",
    description:
      "Develop RESTful API for on-chain reputation management with caching and real-time updates.",
    reward: "950 USDC",
    protocol: "ATXP",
    status: "in-progress",
    difficulty: "Intermediate",
    tags: ["Node.js", "PostgreSQL", "Express", "API"],
    creator: "BuildersHub",
    applicants: 31,
    postedAt: "1 week ago",
    aiManaged: true,
  },
  {
    id: 5,
    title: "Create Mobile App for Bounty Management",
    description:
      "Build a React Native mobile application for browsing and managing bounties on the go.",
    reward: "1,500 USDC",
    protocol: "CASH",
    status: "open",
    difficulty: "Advanced",
    tags: ["React Native", "Mobile", "TypeScript", "Solana"],
    creator: "MobileFirst DAO",
    applicants: 19,
    postedAt: "3 days ago",
    aiManaged: true,
  },
];
