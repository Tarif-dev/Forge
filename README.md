# DevQuest AI - Autonomous Open Source Bounty Management

![DevQuest AI Banner](https://img.shields.io/badge/Solana-x402-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

An AI agent that autonomously manages the entire open source bounty lifecycle using x402 protocol for payments, with multi-protocol support and Phantom CASH integration.

## 🏆 Hackathon Tracks

- 🥇 **Best x402 Agent Application** - Primary Track
- 🥈 **Best Use of CASH** - Phantom CASH Integration
- 🥉 **Best Multi-Protocol Agent** - Multiple Payment Protocols
- 🎯 **Best AgentPay Demo** - HTTP-402 API Payments

## ✨ Key Features

### 🤖 Autonomous AI Agents

- **BountyCreationAgent**: Automatically creates and manages bounties
- **CodeEvaluationAgent**: Evaluates code using paid APIs (HTTP-402)
- **PaymentAgent**: Processes payments via x402 protocol
- **ReputationAgent**: Manages on-chain reputation system
- **MultiProtocolPaymentAgent**: Handles multiple payment protocols
- **CASHPaymentAgent**: Phantom CASH payment processing
- **APIPaymentAgent**: Pays for APIs via HTTP-402
- **CommunicationAgent**: Agent-to-agent coordination

### 💰 Multi-Protocol Payments

- **x402 Protocol**: HTTP-402 payment standard
- **Phantom CASH**: Seamless CASH transactions
- **ATXP Protocol**: Additional protocol support
- **ACP/AP2**: Extended protocol compatibility
- **Auto-conversion**: Automatic protocol switching

### 🛡️ Trustless Reputation System

- On-chain reputation scores
- AI-powered evaluation
- Achievement NFTs
- Fraud detection
- Transparent contributor profiles

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Phantom Wallet (for testing)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/devquest-ai.git
cd devquest-ai
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks

### Blockchain

- **Network**: Solana (Devnet)
- **Wallet**: @solana/wallet-adapter-react
- **Smart Contracts**: Anchor Framework (to be implemented)

### AI & Agents

- **AI Framework**: LangChain (to be implemented)
- **LLM**: OpenAI GPT-4 (to be implemented)
- **Agent Framework**: LangChain Agents (to be implemented)

### Payments

- **x402 Protocol**: HTTP-402 integration (to be implemented)
- **Phantom CASH**: CASH payment support (to be implemented)
- **Multi-Protocol**: ATXP, ACP/AP2 (to be implemented)

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
