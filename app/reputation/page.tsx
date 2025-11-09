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
import { Trophy, Star, Award, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardUser {
  id: string;
  walletAddress: string;
  username: string | null;
  reputationScore: number;
  totalEarned: number;
  createdAt: string;
  _count: {
    createdBounties: number;
    applications: number;
    achievements: number;
  };
}

export default function ReputationPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reputation/leaderboard?limit=50");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalContributors: leaderboard.length,
    avgReputation: leaderboard.length > 0
      ? Math.round(
          leaderboard.reduce((sum, u) => sum + u.reputationScore, 0) /
            leaderboard.length
        )
      : 0,
    totalAchievements: leaderboard.reduce(
      (sum, u) => sum + u._count.achievements,
      0
    ),
    topScore: leaderboard.length > 0 ? leaderboard[0].reputationScore : 0,
  };

  const getLevel = (reputation: number) => {
    if (reputation >= 1000) return { level: "Legend", color: "text-yellow-500" };
    if (reputation >= 800) return { level: "Master", color: "text-purple-500" };
    if (reputation >= 600) return { level: "Expert", color: "text-blue-500" };
    if (reputation >= 400) return { level: "Advanced", color: "text-green-500" };
    if (reputation >= 200) return { level: "Intermediate", color: "text-orange-500" };
    return { level: "Beginner", color: "text-gray-500" };
  };

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Reputation System</h1>
        <p className="text-lg text-muted-foreground">
          On-chain reputation managed by autonomous AI agents
        </p>
      </div>

      {/* Reputation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributors
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContributors}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Reputation
            </CardTitle>
            <Star className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReputation}</div>
            <p className="text-xs text-muted-foreground">Community average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Achievements Earned
            </CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">Total NFTs minted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topScore}</div>
            <p className="text-xs text-muted-foreground">Highest score</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>
            Top contributors ranked by on-chain reputation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Reputation</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Bounties Created</TableHead>
                  <TableHead>Total Earned</TableHead>
                  <TableHead>Achievements</TableHead>
                  <TableHead>Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((user, index) => {
                    const { level, color } = getLevel(user.reputationScore);
                    return (
                      <TableRow
                        key={user.id}
                        className={index < 3 ? "bg-accent/5" : ""}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            )}
                            {index === 1 && (
                              <Trophy className="w-5 h-5 text-gray-400" />
                            )}
                            {index === 2 && (
                              <Trophy className="w-5 h-5 text-amber-600" />
                            )}
                            <span className="font-bold">{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {(user.username || user.walletAddress)
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.username || "Anonymous"}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {user.walletAddress.slice(0, 8)}...
                                {user.walletAddress.slice(-4)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-primary">
                              {user.reputationScore}
                            </div>
                            {user.reputationScore >= 800 && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user._count.applications}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user._count.createdBounties}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${user.totalEarned.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user._count.achievements}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={color}>{level}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              How Reputation Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Complete bounties to earn reputation points</p>
            <p>• High-quality work receives bonus points</p>
            <p>• AI agents automatically track your contributions</p>
            <p>• Reputation is stored on-chain permanently</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Level System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Beginner: 0-199 points</p>
            <p>• Intermediate: 200-399 points</p>
            <p>• Advanced: 400-599 points</p>
            <p>• Expert: 600-799 points</p>
            <p>• Master: 800-999 points</p>
            <p>• Legend: 1000+ points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievement NFTs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Earn NFTs for major milestones</p>
            <p>• NFTs are minted automatically</p>
            <p>• Trade or showcase your achievements</p>
            <p>• Unlock special privileges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
