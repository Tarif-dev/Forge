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
    difficulty: "Intermediate",
    category: "Backend",
    tags: "",
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
          requirements: {
            codeQuality: "High",
            tests: "Required",
            documentation: "Yes",
          },
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
        difficulty: "Intermediate",
        category: "Backend",
        tags: "",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bounty</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new bounty. Make sure your wallet is
            connected.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the bounty requirements in detail..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reward">Reward Amount *</Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
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

          <div className="flex gap-3 pt-4">
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
