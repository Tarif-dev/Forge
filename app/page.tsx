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
import {
  ArrowRight,
  Bot,
  Coins,
  Shield,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-secondary/5 to-white pt-20 pb-32 w-full">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              Powered by x402 Protocol on Solana
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Autonomous AI Agents
              <br />
              Manage Your Bounties
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Forge uses autonomous agents to manage the entire open source
              bounty lifecycle. From creation to payment, everything is
              automated with AI-powered evaluation and multi-protocol support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/bounties">
                <Button size="lg" className="gap-2">
                  Browse Bounties <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/agents">
                <Button size="lg" variant="outline" className="gap-2">
                  <Bot className="w-4 h-4" /> Explore AI Agents
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="container px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Bounties
              </CardTitle>
              <Coins className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">147</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Value Locked
              </CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">
                Across all protocols
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Contributors
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Growing community</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                AI-evaluated bounties
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why DevQuest AI?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of open source collaboration with autonomous
            AI agents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Autonomous AI Agents</CardTitle>
              <CardDescription>
                AI agents handle everything from bounty creation to evaluation
                and payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Code evaluation using paid APIs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Automated payment processing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Agent-to-agent communication
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Multi-Protocol Payments</CardTitle>
              <CardDescription>
                Support for x402, ATXP, ACP/AP2, and Phantom CASH for seamless
                transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  x402 protocol integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Phantom CASH support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Protocol auto-conversion
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Trustless Reputation</CardTitle>
              <CardDescription>
                On-chain reputation system managed by AI for transparent
                contributor profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  On-chain reputation scores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Achievement NFTs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Fraud detection system
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Bounties Section */}
      <section className="container px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Bounties</h2>
            <p className="text-muted-foreground">
              Top bounties managed by our AI agents
            </p>
          </div>
          <Link href="/bounties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBounties.map((bounty) => (
            <Card
              key={bounty.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge
                    variant={bounty.status === "open" ? "default" : "secondary"}
                  >
                    {bounty.status}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">
                    {bounty.reward}
                  </span>
                </div>
                <CardTitle className="mt-4">{bounty.title}</CardTitle>
                <CardDescription>{bounty.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bounty.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>by {bounty.creator}</span>
                  <span>{bounty.applicants} applicants</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 mx-auto max-w-7xl">
        <Card className="bg-linear-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-3xl md:text-4xl">
              Ready to Start Your Journey?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Connect your wallet and explore bounties managed by autonomous AI
              agents. Experience the future of open source collaboration.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/bounties">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}

const featuredBounties = [
  {
    id: 1,
    title: "Implement OAuth2 Authentication",
    description:
      "Add secure OAuth2 authentication flow with support for multiple providers",
    reward: "500 USDC",
    status: "open",
    tags: ["TypeScript", "Security", "Backend"],
    creator: "ProjectDAO",
    applicants: 12,
  },
  {
    id: 2,
    title: "Design Mobile UI Components",
    description:
      "Create reusable mobile-first UI components using React Native",
    reward: "750 USDC",
    status: "open",
    tags: ["React Native", "UI/UX", "Mobile"],
    creator: "DevCollective",
    applicants: 8,
  },
  {
    id: 3,
    title: "Optimize Database Queries",
    description:
      "Improve performance of critical database queries and add proper indexing",
    reward: "400 USDC",
    status: "open",
    tags: ["PostgreSQL", "Performance", "Backend"],
    creator: "TechStartup",
    applicants: 15,
  },
];
