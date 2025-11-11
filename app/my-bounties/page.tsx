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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Clock,
  ExternalLink,
  Sparkles,
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
  user: {
    id: string;
    username: string | null;
    walletAddress: string;
    reputationScore: number;
  };
}

interface Bounty {
  id: string;
  title: string;
  reward: number;
  rewardToken: string;
  status: string;
  difficulty: string;
  paymentProtocol?: string;
  autoPayThreshold?: number;
  createdAt: string;
  applications: Application[];
  _count: {
    applications: number;
  };
}

export default function MyBountiesPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchMyBounties();
    } else {
      setLoading(false);
    }
  }, [connected, publicKey]);

  const fetchMyBounties = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/${publicKey.toBase58()}?include=bounties`
      );

      if (!response.ok) throw new Error("Failed to fetch bounties");

      const userData = await response.json();
      setBounties(userData.bountiesCreated || []);
    } catch (error) {
      console.error("Error fetching bounties:", error);
      toast({
        title: "Error",
        description: "Failed to load your bounties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, bountyId: string) => {
    setActionLoading(true);
    try {
      // Evaluate the application using AI
      const evaluateResponse = await fetch(
        `/api/applications/${applicationId}/evaluate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "approve" }),
        }
      );

      if (!evaluateResponse.ok) {
        throw new Error("Failed to evaluate application");
      }

      const result = await evaluateResponse.json();

      toast({
        title: "✅ Application Approved!",
        description: `AI Evaluation Score: ${result.evaluationScore}/100. ${
          result.autoPaid
            ? "🤖 x402 processed payment automatically!"
            : "Ready for manual payment."
        }`,
      });

      setSelectedApplication(null);
      fetchMyBounties();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/applications/${applicationId}/evaluate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reject" }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject application");

      toast({
        title: "Application Rejected",
        description: "The application has been rejected",
      });

      setSelectedApplication(null);
      fetchMyBounties();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your bounties
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
          <p className="mt-4 text-muted-foreground">Loading your bounties...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: bounties.length,
    active: bounties.filter((b) => b.status === "OPEN").length,
    pending: bounties.reduce(
      (sum, b) =>
        sum + b.applications.filter((a) => a.status === "PENDING").length,
      0
    ),
  };

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">My Bounties</h1>
        <p className="text-lg text-muted-foreground">
          Manage your bounties and review applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bounties
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bounties List */}
      {bounties.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Bounties Yet</CardTitle>
            <CardDescription>
              Create your first bounty to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/bounties")}>
              Create Bounty
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bounties.map((bounty) => (
            <Card key={bounty.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{bounty.title}</CardTitle>
                      <Badge
                        variant={
                          bounty.status === "OPEN" ? "default" : "secondary"
                        }
                      >
                        {bounty.status}
                      </Badge>
                      {bounty.paymentProtocol === "X402" && (
                        <Badge variant="outline" className="gap-1">
                          <Sparkles className="w-3 h-3" />
                          x402 Auto-Pay
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary text-lg">
                        ${bounty.reward} {bounty.rewardToken}
                      </span>
                      <span>•</span>
                      <span>{bounty.difficulty}</span>
                      <span>•</span>
                      <span>
                        {bounty._count.applications} application
                        {bounty._count.applications !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <Link href={`/bounties/${bounty.id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Bounty
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              {bounty.applications.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      Applications ({bounty.applications.length})
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bounty.applications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>
                                    {(
                                      app.user.username ||
                                      app.user.walletAddress
                                    )
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {app.user.username || "Anonymous"}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono">
                                    {app.user.walletAddress.slice(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  app.status === "APPROVED"
                                    ? "default"
                                    : app.status === "PAID"
                                    ? "secondary"
                                    : app.status === "REJECTED"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {app.evaluationScore !== null &&
                              app.evaluationScore !== undefined ? (
                                <span className="font-bold text-primary">
                                  {app.evaluationScore}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  View
                                </Button>
                                {app.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleApprove(app.id, bounty.id)
                                      }
                                      disabled={actionLoading}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleReject(app.id)}
                                      disabled={actionLoading}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <Dialog
          open={!!selectedApplication}
          onOpenChange={() => setSelectedApplication(null)}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review this application from{" "}
                {selectedApplication.user.username || "Anonymous"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Applicant</h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {(
                        selectedApplication.user.username ||
                        selectedApplication.user.walletAddress
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {selectedApplication.user.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {selectedApplication.user.walletAddress}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reputation: {selectedApplication.user.reputationScore}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Message</h4>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                  {selectedApplication.message}
                </p>
              </div>

              {selectedApplication.githubPrUrl && (
                <div>
                  <h4 className="font-semibold mb-2">GitHub</h4>
                  <a
                    href={selectedApplication.githubPrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {selectedApplication.githubPrUrl}
                  </a>
                </div>
              )}

              {selectedApplication.evaluationScore !== null &&
                selectedApplication.evaluationScore !== undefined && (
                  <div>
                    <h4 className="font-semibold mb-2">AI Evaluation</h4>
                    <div className="text-2xl font-bold text-primary">
                      Score: {selectedApplication.evaluationScore}/100
                    </div>
                  </div>
                )}

              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Badge
                  variant={
                    selectedApplication.status === "APPROVED"
                      ? "default"
                      : selectedApplication.status === "PAID"
                      ? "secondary"
                      : selectedApplication.status === "REJECTED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {selectedApplication.status}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
