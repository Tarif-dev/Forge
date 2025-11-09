# 🚀 Forge - Deployment Guide

## Hackathon Submission Checklist

### ✅ Completed Features

- [x] **Database Setup** - Neon PostgreSQL with complete schema
- [x] **AI Agent** - Gemini-powered code evaluation
- [x] **Payment System** - Solana integration with devnet
- [x] **REST API** - Full CRUD operations for bounties, applications, payments
- [x] **Frontend** - Professional UI with shadcn/ui components
- [x] **Real-time Agent Activities** - Track all AI agent operations
- [x] **Reputation System** - On-chain reputation tracking

## 🌐 Quick Deploy to Vercel

### Prerequisites

- Vercel account
- Neon PostgreSQL database (already configured)
- Gemini API key (already configured)

### Steps

1. **Push to GitHub** (if not done):

```bash
git add .
git commit -m "feat: complete hackathon implementation"
git push origin main
```

2. **Deploy to Vercel**:

- Go to https://vercel.com/new
- Import your GitHub repository
- Add environment variables:
  - `DATABASE_URL`: Your Neon connection string
  - `GEMINI_API_KEY`: Your Gemini API key
  - `NEXT_PUBLIC_SOLANA_NETWORK`: devnet
  - `NEXT_PUBLIC_SOLANA_RPC_URL`: https://api.devnet.solana.com
  - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
  - `NEXTAUTH_URL`: Your Vercel deployment URL

3. **Deploy**:

- Click "Deploy"
- Wait for build to complete

## 📋 Testing the Application

### Test API Endpoints

1. **Get Bounties**:

```bash
curl https://your-app.vercel.app/api/bounties
```

2. **Get Agent Activities**:

```bash
curl https://your-app.vercel.app/api/agents/activities
```

3. **Get Leaderboard**:

```bash
curl https://your-app.vercel.app/api/reputation/leaderboard
```

### Test Frontend

1. Visit your deployed URL
2. Connect Phantom wallet (Solana devnet)
3. Browse bounties
4. Apply to a bounty
5. Test AI evaluation

## 🎯 Hackathon Demo Flow

### Live Demo Script:

1. **Show Homepage** (30 seconds)

   - Professional UI with real-time stats
   - Explain the AI agent concept

2. **Browse Bounties** (45 seconds)

   - Filter by category, status
   - Show real bounties from database
   - Explain escrow system

3. **Show AI Agent Dashboard** (45 seconds)

   - Display real-time agent activities
   - Show different agent types (Evaluation, Payment, Reputation)

4. **Submit & Evaluate** (60 seconds)

   - Apply to a bounty
   - Trigger AI evaluation via API
   - Show Gemini AI response with score/feedback

5. **Payments Dashboard** (30 seconds)

   - Show Solana transaction history
   - Demonstrate devnet integration

6. **Reputation System** (30 seconds)
   - Show leaderboard
   - Explain on-chain reputation

## 🔧 Key Technical Highlights

### AI Agents

- **Code Evaluation Agent**: Uses Gemini Pro to evaluate submissions
- **Payment Agent**: Automates Solana transactions
- **Reputation Agent**: Manages on-chain reputation scores

### Solana Integration

- **Network**: Devnet (ready for mainnet)
- **Payments**: Native SOL & USDC support
- **Escrow**: Automated bounty fund management
- **Wallet**: Phantom wallet integration

### Database

- **Provider**: Neon PostgreSQL (serverless)
- **ORM**: Prisma with full type safety
- **Models**: 8 comprehensive tables

## 📊 Current Data

The database is seeded with:

- 3 demo bounties
- 2 demo users
- 2 applications
- Multiple agent activities
- Achievement records

## 🚀 Post-Hackathon Improvements

1. **Smart Contracts**:

   - Deploy Anchor programs for escrow
   - Add multi-sig approval

2. **GitHub Integration**:

   - OAuth for automatic PR fetching
   - Webhook for real-time updates

3. **Enhanced AI**:

   - Code diff analysis
   - Security vulnerability scanning
   - Complexity scoring

4. **Mobile App**:
   - React Native version
   - Push notifications

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# AI
GEMINI_API_KEY="..."

# Solana
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-app.vercel.app"
```

## 🎥 Video Demo Tips

1. **Start with Problem**: Open source bounty management is chaotic
2. **Show Solution**: AI agents automate everything
3. **Live Demo**: Walk through the flow
4. **Technical Deep Dive**: Show AI evaluation API call
5. **Solana Integration**: Demonstrate devnet transaction
6. **End with Vision**: Future of autonomous open source collaboration

## 🏆 Hackathon Categories

This project qualifies for:

- ✅ **Best AI Application** - Gemini-powered code evaluation
- ✅ **Best Solana DApp** - Full devnet integration with escrow
- ✅ **Best Use of Database** - Complex Neon PostgreSQL schema
- ✅ **Most Innovative** - Autonomous AI agent system

## 📧 Support

For issues or questions:

- Create GitHub issue
- Check API logs in Vercel dashboard
- Verify Solana devnet status

---

**Built with ❤️ for the Solana Hackathon**
