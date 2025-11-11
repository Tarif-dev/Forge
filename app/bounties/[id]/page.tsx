"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  GitPullRequest,
  User,
  Award,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  requirements: string;
  githubRepoUrl?: string;
  githubIssueUrl?: string;
  paymentProtocol?: string;
  autoPayThreshold?: number;
  createdAt: string;
  deadline?: string;
  creator: {
    id: string;
    username: string | null;
    walletAddress: string;
    reputationScore: number;
  };
  applications: Array<{
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
  }>;
}

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    message: "",
    githubPrUrl: "",
  });

  useEffect(() => {
    fetchBountyDetails();
  }, [params.id]);

  const fetchBountyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bounties/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Bounty not found");
        } else {
          setError("Failed to load bounty details");
        }
        return;
      }

      const data = await response.json();
      setBounty(data);
    } catch (error) {
      console.error("Error fetching bounty:", error);
      setError("Failed to load bounty details");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to apply for bounties",
        variant: "destructive",
      });
      return;
    }
    setShowApplyDialog(true);
  };

  const handleApplySubmit = async () => {
    if (!publicKey || !bounty) return;

    if (!applicationForm.message.trim()) {
      toast({
        title: "Message required",
        description:
          "Please provide a message explaining why you're a good fit",
        variant: "destructive",
      });
      return;
    }

    try {
      setApplying(true);
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bountyId: bounty.id,
          walletAddress: publicKey.toBase58(),
          message: applicationForm.message,
          githubPrUrl: applicationForm.githubPrUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully",
      });

      setShowApplyDialog(false);
      setApplicationForm({ message: "", githubPrUrl: "" });
      fetchBountyDetails(); // Refresh to show the new application
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Failed to submit application",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "COMPLETED":
        return "outline";
      default:
        return "outline";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-500/10 text-green-500";
      case "INTERMEDIATE":
        return "bg-yellow-500/10 text-yellow-500";
      case "ADVANCED":
        return "bg-orange-500/10 text-orange-500";
      case "EXPERT":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !bounty) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-7xl w-full">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Bounty not found"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/bounties")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bounties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 space-y-8 mx-auto max-w-7xl w-full">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/bounties")}
        variant="ghost"
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bounties
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={getStatusColor(bounty.status)}>
              {bounty.status}
            </Badge>
            <Badge className={getDifficultyColor(bounty.difficulty)}>
              {bounty.difficulty}
            </Badge>
            <Badge variant="outline">{bounty.category}</Badge>
            {bounty.paymentProtocol && (
              <Badge variant="secondary">
                {bounty.paymentProtocol === "X402"
                  ? "🤖 x402 Autonomous"
                  : bounty.paymentProtocol}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold">{bounty.title}</h1>
        </div>

        <Card className="border-primary/30 bg-primary/5 min-w-[200px] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bounty Reward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold text-primary">
                {bounty.reward}
              </span>
              <span className="text-lg text-muted-foreground">
                {bounty.rewardToken}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {bounty.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {bounty.requirements}
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bounty.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Applications ({bounty.applications.length})</CardTitle>
              <CardDescription>
                Contributors who have applied to this bounty
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bounty.applications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No applications yet. Be the first to apply!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bounty.applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {(app.user.username || app.user.walletAddress)
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
                                : "outline"
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.evaluationScore ? (
                            <span className="font-bold text-primary">
                              {app.evaluationScore}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(app.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Created By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {(bounty.creator.username || bounty.creator.walletAddress)
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">
                    {bounty.creator.username || "Anonymous"}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {bounty.creator.walletAddress}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {bounty.creator.reputationScore}
                </span>
                <span className="text-muted-foreground">Reputation</span>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bounty Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {formatDate(bounty.createdAt)}
                  </div>
                </div>
              </div>

              {bounty.deadline && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Deadline</div>
                    <div className="font-medium">
                      {formatDate(bounty.deadline)}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Applicants</div>
                  <div className="font-medium">
                    {bounty.applications.length}
                  </div>
                </div>
              </div>

              {bounty.autoPayThreshold && (
                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Auto-Pay Score</div>
                    <div className="font-medium">
                      ≥ {bounty.autoPayThreshold}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          {(bounty.githubRepoUrl || bounty.githubIssueUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {bounty.githubRepoUrl && (
                  <a
                    href={bounty.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <GitPullRequest className="w-4 h-4" />
                    GitHub Repository
                  </a>
                )}
                {bounty.githubIssueUrl && (
                  <a
                    href={bounty.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <GitPullRequest className="w-4 h-4" />
                    GitHub Issue
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Apply Button */}
          {bounty.status === "OPEN" && (
            <Card className="border-primary/30 bg-primary/5 shadow-sm">
              <CardContent className="pt-6">
                <Button className="w-full" size="lg" onClick={handleApplyClick}>
                  Apply to Bounty
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Submit your application to work on this bounty
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Apply to Bounty</DialogTitle>
            <DialogDescription>
              Submit your application to work on "{bounty?.title}". Tell us why
              you're the right person for this bounty.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Explain why you're a good fit for this bounty, your relevant experience, and your approach to solving it..."
                value={applicationForm.message}
                onChange={(e) =>
                  setApplicationForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows={6}
                disabled={applying}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="githubPrUrl">GitHub PR/Repository URL</Label>
              <Input
                id="githubPrUrl"
                placeholder="https://github.com/username/repo (optional)"
                value={applicationForm.githubPrUrl}
                onChange={(e) =>
                  setApplicationForm((prev) => ({
                    ...prev,
                    githubPrUrl: e.target.value,
                  }))
                }
                disabled={applying}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Link to your GitHub profile or relevant work
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApplyDialog(false)}
              disabled={applying}
            >
              Cancel
            </Button>
            <Button onClick={handleApplySubmit} disabled={applying}>
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
