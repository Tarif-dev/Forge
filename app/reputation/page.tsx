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
import { Trophy, TrendingUp, Award, Star, Target, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ReputationPage() {
  return (
    <div className="container px-4 py-12 space-y-8">
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
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+23% this month</p>
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
            <div className="text-2xl font-bold">742</div>
            <p className="text-xs text-muted-foreground">Out of 1000</p>
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
            <div className="text-2xl font-bold">3,847</div>
            <p className="text-xs text-muted-foreground">Total NFTs minted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">987</div>
            <p className="text-xs text-muted-foreground">Highest score</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Leaderboard based on on-chain reputation scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-time">
            <TabsList>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
            </TabsList>
            <TabsContent value="all-time" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Contributor</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Achievements</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((user, index) => (
                    <TableRow
                      key={user.address}
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
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {user.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-primary">
                            {user.reputation}
                          </div>
                          <Badge
                            variant={
                              user.trend === "up" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.change > 0 ? "+" : ""}
                            {user.change}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.completed}
                      </TableCell>
                      <TableCell className="font-bold text-secondary">
                        {user.earned}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.badges.map((badge, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                            >
                              {badge}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.level}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="monthly">
              <div className="text-center py-8 text-muted-foreground">
                Monthly leaderboard will be displayed here
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="text-center py-8 text-muted-foreground">
                Weekly leaderboard will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Achievement Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievementCategories.map((category) => (
            <Card
              key={category.name}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.achievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-accent/5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{achievement.emoji}</div>
                        <div>
                          <div className="font-medium text-sm">
                            {achievement.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.requirement}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +{achievement.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reputation Factors */}
      <Card>
        <CardHeader>
          <CardTitle>How Reputation is Calculated</CardTitle>
          <CardDescription>
            AI-powered reputation system factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reputationFactors.map((factor) => (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {factor.weight}%
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${factor.weight}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const leaderboard = [
  {
    name: "Alice.dev",
    address: "7a8b9c...def456",
    reputation: 987,
    change: 45,
    trend: "up",
    completed: 156,
    earned: "$142K",
    badges: ["🏆", "⭐", "🔥", "💎"],
    level: "Diamond",
  },
  {
    name: "Bob.eth",
    address: "3f4e5d...abc123",
    reputation: 924,
    change: 32,
    trend: "up",
    completed: 134,
    earned: "$118K",
    badges: ["🏆", "⭐", "🔥"],
    level: "Platinum",
  },
  {
    name: "Charlie.sol",
    address: "1a2b3c...xyz789",
    reputation: 876,
    change: 28,
    trend: "up",
    completed: 121,
    earned: "$98K",
    badges: ["🏆", "⭐"],
    level: "Platinum",
  },
  {
    name: "Diana.crypto",
    address: "9d8e7f...ghi012",
    reputation: 823,
    change: 15,
    trend: "up",
    completed: 98,
    earned: "$87K",
    badges: ["🏆", "⭐"],
    level: "Gold",
  },
  {
    name: "Eve.blockchain",
    address: "6c5d4e...jkl345",
    reputation: 789,
    change: 22,
    trend: "up",
    completed: 92,
    earned: "$76K",
    badges: ["🏆"],
    level: "Gold",
  },
  {
    name: "Frank.web3",
    address: "4b3a2c...mno678",
    reputation: 745,
    change: -5,
    trend: "down",
    completed: 87,
    earned: "$69K",
    badges: ["⭐"],
    level: "Gold",
  },
];

const achievementCategories = [
  {
    name: "Bounty Hunter",
    description: "Complete bounties to earn these achievements",
    icon: <Target className="w-6 h-6 text-primary" />,
    achievements: [
      {
        name: "First Blood",
        emoji: "🎯",
        requirement: "Complete 1st bounty",
        points: 50,
      },
      {
        name: "Rising Star",
        emoji: "⭐",
        requirement: "Complete 10 bounties",
        points: 200,
      },
      {
        name: "Elite Hunter",
        emoji: "🏆",
        requirement: "Complete 50 bounties",
        points: 1000,
      },
    ],
  },
  {
    name: "Code Quality",
    description: "High-quality code submissions",
    icon: <Star className="w-6 h-6 text-secondary" />,
    achievements: [
      {
        name: "Clean Coder",
        emoji: "✨",
        requirement: "95% avg score",
        points: 300,
      },
      {
        name: "Bug Hunter",
        emoji: "🐛",
        requirement: "Zero bugs in 10 submissions",
        points: 500,
      },
      {
        name: "Perfectionist",
        emoji: "💎",
        requirement: "100% score on 5 bounties",
        points: 750,
      },
    ],
  },
  {
    name: "Speed Demon",
    description: "Fast completion times",
    icon: <Zap className="w-6 h-6 text-accent" />,
    achievements: [
      {
        name: "Quick Draw",
        emoji: "⚡",
        requirement: "Complete in < 24h",
        points: 100,
      },
      {
        name: "Flash",
        emoji: "🚀",
        requirement: "Complete 10 in < 48h",
        points: 400,
      },
      {
        name: "Lightning",
        emoji: "⚡",
        requirement: "Complete 25 in < 72h",
        points: 800,
      },
    ],
  },
];

const reputationFactors = [
  {
    name: "Bounties Completed",
    weight: 30,
    description: "Number of successfully completed bounties",
  },
  {
    name: "Code Quality Score",
    weight: 25,
    description: "Average AI-evaluated code quality across all submissions",
  },
  {
    name: "Community Feedback",
    weight: 20,
    description: "Reviews and ratings from project maintainers",
  },
  {
    name: "Response Time",
    weight: 15,
    description: "Average time to complete bounties",
  },
  {
    name: "Consistency",
    weight: 10,
    description: "Regular participation and submission frequency",
  },
];
