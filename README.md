# 🚀 Forge - AI-Powered Bounty Platform on Solana

![Forge Banner](https://img.shields.io/badge/Solana-Devnet-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4)

**Autonomous bounty management with AI agents on Solana blockchain** - A revolutionary platform that leverages Google's Gemini AI to automatically evaluate code submissions, process payments on Solana, and manage on-chain reputation.

## 🏆 Hackathon Highlights

This project qualifies for:

- ✅ **Best AI Application** - Gemini-powered code evaluation
- ✅ **Best Solana DApp** - Full devnet integration with SPL tokens
- ✅ **Best Use of Database** - Complex Neon PostgreSQL schema with 8 models
- ✅ **Most Innovative** - Autonomous AI agent ecosystem

## ✨ Key Features

### 🤖 Fully Implemented AI Agents

✅ **CodeEvaluationAgent** (LIVE)

- Uses Google Gemini Pro for code evaluation
- Scores submissions 0-100 with detailed feedback
- Auto-approves high-quality work (score ≥70)
- Identifies strengths and weaknesses
- ~1,000 lines of production code

✅ **PaymentAgent** (LIVE)

- Processes Solana transactions automatically
- Supports native SOL and USDC (SPL tokens)
- Verifies blockchain transactions
- Updates user earnings in real-time
- Full devnet integration

✅ **ReputationAgent** (LIVE)

- Manages on-chain reputation scores
- Automatic updates after payments
- Level progression system (Beginner → Legend)
- Achievement tracking with NFT minting ready
- Transparent leaderboard

### � Complete Solana Integration

✅ **Payment Infrastructure**

- Native SOL transfers
- USDC SPL token support
- Transaction verification
- Escrow management
- Real-time balance checking

✅ **Wallet Support**

- Phantom Wallet
- Solflare
- Coinbase Wallet
- Torus
- Custom UI with dropdown menu

### �️ Production Database

✅ **Neon PostgreSQL + Prisma**

- 8 comprehensive models
- Full relationship mapping
- Automatic migrations
- Seeded demo data
- Connection pooling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- **Phantom Wallet** with Solana devnet SOL
- Neon PostgreSQL account (or any PostgreSQL database)
- Google Gemini API key

### Quick Start

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/forge.git
cd forge
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
```

4. **Set up database**:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Start development server**:

```bash
npm run dev
```

6. **Open** [http://localhost:3000](http://localhost:3000)

### Testing

Demo accounts are seeded:

- **alice_dev**: 850 reputation, $5,000 earned
- **bob_builder**: 720 reputation, $3,500 earned

Test bounties available:

- Frontend bounty ($1,200)
- Backend bounty ($800)
- Smart contract bounty ($1,500)

## 🏗️ Tech Stack

### Frontend (Complete ✅)

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (18+ components)
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend (Complete ✅)

- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma v6.19.0
- **API**: Next.js API Routes (REST)
- **Authentication**: Wallet-based (NextAuth ready)

### AI & Agents (Complete ✅)

- **AI Model**: Google Gemini Pro
- **Code Evaluation**: Custom evaluation agent
- **Agent System**: 3 active agents (Evaluation, Payment, Reputation)
- **Activity Tracking**: Real-time agent monitoring

### Blockchain (Complete ✅)

- **Network**: Solana Devnet
- **SDK**: @solana/web3.js v1.98.4
- **Tokens**: Native SOL + USDC (SPL)
- **Wallet**: Multi-wallet adapter (Phantom, Solflare, Coinbase, Torus)
- **Payments**: Automated transaction processing

## 📁 Project Structure

```
devquest-ai/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── bounties/            # Bounty marketplace
│   ├── agents/              # AI agents dashboard
│   ├── payments/            # Payment dashboard
│   ├── reputation/          # Reputation system
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── layout/              # Layout components
│   │   ├── navbar.tsx       # Navigation bar
│   │   └── footer.tsx       # Footer
│   ├── providers/           # Context providers
│   │   ├── wallet-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── package.json             # Dependencies
```

## 🎨 Features Overview

### Home Page

- Hero section with gradient animations
- Real-time statistics dashboard
- Featured bounties showcase
- Key features presentation
- Call-to-action sections

### Bounty Marketplace

- Advanced search and filtering
- Multi-category tabs
- AI-managed bounty badges
- Protocol indicators
- Real-time applicant count

### AI Agents Dashboard

- 8 specialized AI agents
- Live activity monitoring
- Performance metrics
- Task completion tracking
- Agent capabilities overview

### Payment Dashboard

- Multi-protocol transaction history
- Payment volume analytics
- Protocol distribution charts
- Top recipients leaderboard
- Real-time transaction status

### Reputation System

- On-chain reputation scores
- Global leaderboard
- Achievement categories
- NFT badges
- Reputation factors breakdown

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

## 🙏 Acknowledgments

- Solana Foundation for the hackathon
- x402 Protocol team for payment infrastructure
- Phantom Wallet for CASH support
- shadcn/ui for beautiful components
- Next.js team for the amazing framework

---

Built with ❤️ for the Solana x402 Hackathon
