"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Search, DollarSign, Users, GitPullRequest } from "lucide-react";
import { CreateBountyDialog } from "@/components/create-bounty-dialog";

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardToken: string;
  status: string;
  difficulty: string;
  category: string;
  tags: string[];
  createdAt: string;
  creator: {
    username: string | null;
    walletAddress: string;
    reputationScore: number;
  };
  _count: {
    applications: number;
  };
}

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchBounties();
  }, [statusFilter, categoryFilter]);

  const fetchBounties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(`/api/bounties?${params.toString()}`);
      const data = await response.json();
      setBounties(data);
    } catch (error) {
      console.error("Error fetching bounties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBounties = bounties.filter(
    (bounty) =>
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    open: bounties.filter((b) => b.status === "OPEN").length,
    totalRewards: bounties.reduce((sum, b) => sum + b.reward, 0),
    totalApplications: bounties.reduce(
      (sum, b) => sum + b._count.applications,
      0
    ),
  };

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Bounty Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Discover and claim bounties managed by autonomous AI agents
          </p>
        </div>
        <CreateBountyDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bounties</CardTitle>
            <GitPullRequest className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRewards.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Smart Contract">Smart Contract</SelectItem>
            <SelectItem value="UI/UX">UI/UX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bounties List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading bounties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <Card
              key={bounty.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant={bounty.status === "OPEN" ? "default" : "secondary"}
                  >
                    {bounty.status}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">
                    ${bounty.reward}
                  </span>
                </div>
                <CardTitle className="mt-4 line-clamp-2">
                  {bounty.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {bounty.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {bounty.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {bounty.category}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bounty.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                    <span>
                      by{" "}
                      {bounty.creator.username ||
                        bounty.creator.walletAddress.slice(0, 8)}
                    </span>
                    <span>{bounty._count.applications} applicants</span>
                  </div>
                  <Link href={`/bounties/${bounty.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredBounties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bounties found</p>
        </div>
      )}
    </div>
  );
}
