"use client";

import Link from "next/link";
import { Github, Twitter, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">DevQuest AI</h3>
            <p className="text-sm text-muted-foreground">
              Autonomous open source bounty management powered by AI agents and
              x402 protocol.
            </p>
            <div className="flex gap-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-md border bg-background hover:bg-accent transition-colors">
                  <Github className="w-4 h-4" />
                </div>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-md border bg-background hover:bg-accent transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
              </Link>
              <Link
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-md border bg-background hover:bg-accent transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/bounties"
                  className="hover:text-foreground transition-colors"
                >
                  Browse Bounties
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="hover:text-foreground transition-colors"
                >
                  AI Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/payments"
                  className="hover:text-foreground transition-colors"
                >
                  Payments
                </Link>
              </li>
              <li>
                <Link
                  href="/reputation"
                  className="hover:text-foreground transition-colors"
                >
                  Reputation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="hover:text-foreground transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 DevQuest AI. All rights reserved.</p>
          <p>Built on Solana with x402 Protocol</p>
        </div>
      </div>
    </footer>
  );
}
