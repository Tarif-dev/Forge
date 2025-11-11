"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateBountyDialog() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    rewardToken: "USDC",
    difficulty: "INTERMEDIATE",
    category: "Backend",
    tags: "",
    paymentProtocol: "X402",
    autoPayThreshold: "70",
    githubRepoUrl: "",
    githubIssueUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a bounty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bounties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          reward: parseFloat(formData.reward),
          rewardToken: formData.rewardToken,
          difficulty: formData.difficulty,
          category: formData.category,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          creatorWalletAddress: publicKey.toString(),
          paymentProtocol: formData.paymentProtocol,
          autoPayThreshold: parseFloat(formData.autoPayThreshold),
          requirements:
            "High code quality required. Tests and documentation must be included.",
          githubRepoUrl: formData.githubRepoUrl || undefined,
          githubIssueUrl: formData.githubIssueUrl || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bounty");
      }

      const bounty = await response.json();

      toast({
        title: "Success!",
        description: `Bounty "${bounty.title}" created successfully`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        reward: "",
        rewardToken: "USDC",
        difficulty: "INTERMEDIATE",
        category: "Backend",
        tags: "",
        paymentProtocol: "X402",
        autoPayThreshold: "70",
        githubRepoUrl: "",
        githubIssueUrl: "",
      });

      setOpen(false);

      // Refresh the page to show new bounty
      window.location.reload();
    } catch (error) {
      console.error("Error creating bounty:", error);
      toast({
        title: "Error",
        description: "Failed to create bounty. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Bounty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bounty</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new bounty. Make sure your wallet is
            connected.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Implement OAuth2 Authentication"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the bounty requirements in detail..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          {/* Reward, Token, Difficulty, Category - 4 columns */}
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="reward">Reward *</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0"
                placeholder="100"
                value={formData.reward}
                onChange={(e) =>
                  setFormData({ ...formData, reward: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewardToken">Token</Label>
              <Select
                value={formData.rewardToken}
                onValueChange={(value) =>
                  setFormData({ ...formData, rewardToken: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Smart Contract">Smart Contract</SelectItem>
                  <SelectItem value="UI/UX">UI/UX</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Settings and Tags - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="paymentProtocol">💰 Payment Protocol</Label>
              <Select
                value={formData.paymentProtocol}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentProtocol: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X402">🤖 x402 Autonomous</SelectItem>
                  <SelectItem value="CASH">⚡ Phantom CASH</SelectItem>
                  <SelectItem value="SOL">💎 SOL</SelectItem>
                  <SelectItem value="USDC">💵 USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoPayThreshold">Auto-Pay Score (≥)</Label>
              <Input
                id="autoPayThreshold"
                type="number"
                step="1"
                min="0"
                max="100"
                placeholder="70"
                value={formData.autoPayThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoPayThreshold: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Tags - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="React, TypeScript, API, Testing"
              value={formData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          {/* GitHub URLs - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="githubRepoUrl">� GitHub Repo (Optional)</Label>
              <Input
                id="githubRepoUrl"
                placeholder="https://github.com/username/repo"
                value={formData.githubRepoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubRepoUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubIssueUrl">🔗 GitHub Issue (Optional)</Label>
              <Input
                id="githubIssueUrl"
                placeholder="https://github.com/username/repo/issues/123"
                value={formData.githubIssueUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubIssueUrl: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Bounty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
