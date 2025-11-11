"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface Application {
  id: string;
  message: string;
  status: string;
  githubPrUrl?: string;
  evaluationScore?: number;
  createdAt: string;
  bounty: {
    id: string;
    title: string;
    reward: number;
    rewardToken: string;
    status: string;
  };
}

interface UserProfile {
  id: string;
  username: string | null;
  walletAddress: string;
  email: string | null;
  reputationScore: number;
  totalEarned: number;
  applications: Application[];
}

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && publicKey) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [connected, publicKey]);

  const fetchProfile = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${publicKey.toBase58()}`);

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Unable to load profile data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = {
    totalApplications: profile.applications.length,
    approved: profile.applications.filter(
      (a) => a.status === "APPROVED" || a.status === "PAID"
    ).length,
    paid: profile.applications.filter((a) => a.status === "PAID").length,
    pending: profile.applications.filter((a) => a.status === "PENDING").length,
  };

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {(profile.username || profile.walletAddress)
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">
              {profile.username || "Developer"}
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {profile.walletAddress}
            </p>
          </div>
        </div>
        <Button onClick={fetchProfile} disabled={loading} variant="outline">
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${profile.totalEarned}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paid} bounties completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Award className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile.reputationScore}</div>
            <p className="text-xs text-muted-foreground mt-1">Score points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalApplications > 0
                ? Math.round((stats.paid / stats.totalApplications) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paid} of {stats.totalApplications}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Track all your bounty applications and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No applications yet. Start applying to bounties!
              </p>
              <Link href="/bounties">
                <Button>Browse Bounties</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bounty</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.bounty.title}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        ${app.bounty.reward} {app.bounty.rewardToken}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "PAID"
                            ? "default"
                            : app.status === "APPROVED"
                            ? "secondary"
                            : app.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {app.status === "PAID" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {app.status === "PENDING" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {app.status === "REJECTED" && (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.evaluationScore !== null &&
                      app.evaluationScore !== undefined ? (
                        <span className="font-bold text-primary">
                          {app.evaluationScore}/100
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/bounties/${app.bounty.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
