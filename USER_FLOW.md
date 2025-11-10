# 🎯 Forge Platform - Complete User Flow

## 📋 Table of Contents

1. [Initial User Journey](#initial-user-journey)
2. [Bounty Creator Flow](#bounty-creator-flow)
3. [Contributor Flow](#contributor-flow)
4. [AI Agent Automation](#ai-agent-automation)
5. [Technical Data Flow](#technical-data-flow)

---

## 🚀 Initial User Journey

### Step 1: Landing on the Platform

```
User visits https://forge.vercel.app
↓
Homepage loads with:
- Hero section showing platform value proposition
- Real-time statistics (total bounties, contributors, payments)
- Featured bounties
- Call-to-action buttons
```

**What happens behind the scenes:**

- Next.js server-side renders the homepage
- No authentication required yet
- Public data fetched from API

---

### Step 2: Connecting Wallet

```
User clicks "Connect Wallet" button (top-right navbar)
↓
Wallet selection dropdown appears:
├── Phantom Wallet
├── Solflare
├── Coinbase Wallet
└── Torus

User selects their wallet (e.g., Phantom)
↓
Phantom extension opens
↓
User approves connection
↓
Success! Wallet connected
```

**What happens behind the scenes:**

```typescript
// components/wallet-button.tsx
1. @solana/wallet-adapter-react detects available wallets
2. User clicks their preferred wallet
3. wallet.connect() is called
4. Wallet prompts for approval
5. publicKey becomes available
6. Button shows truncated address: "7xKXY...9pQs"
```

**Database Check:**

```typescript
// When user performs their first action
1. System checks if walletAddress exists in User table
2. If NO → Create new user record automatically
3. If YES → Retrieve existing user data

User {
  walletAddress: "7xKXY...9pQs",
  username: null,
  reputationScore: 0,
  totalEarned: 0
}
```

---

## 💰 Bounty Creator Flow

### Step 3A: Creating a Bounty

```
User navigates to /bounties
↓
Clicks "Create Bounty" button
↓
Dialog form opens
```

**Form Fields:**

```
📝 Title: "Implement OAuth2 Authentication"
📄 Description: "Add GitHub OAuth login with secure token management..."
💵 Reward: 500 USDC
🪙 Token: [SOL | USDC]
📊 Difficulty: [Beginner | Intermediate | Advanced | Expert]
📁 Category: [Frontend | Backend | Smart Contract | UI/UX | DevOps | Documentation]
🏷️ Tags: "OAuth, TypeScript, Security"
```

**What happens when user clicks "Create Bounty":**

```typescript
// components/create-bounty-dialog.tsx

1. Validate wallet is connected
   if (!connected) → Show error toast: "Please connect wallet"

2. Validate form fields
   - Title: required
   - Description: required
   - Reward: must be > 0

3. Make API call
   POST /api/bounties
   Body: {
     title: "Implement OAuth2...",
     description: "Add GitHub...",
     reward: 500,
     rewardToken: "USDC",
     difficulty: "Intermediate",
     category: "Backend",
     tags: ["OAuth", "TypeScript", "Security"],
     creatorWalletAddress: "7xKXY...9pQs",
     requirements: {
       codeQuality: "High",
       tests: "Required",
       documentation: "Yes"
     }
   }
```

**Backend Processing:**

```typescript
// app/api/bounties/route.ts

1. Extract data from request
2. Check if creator exists in database
   └─ If NO → Create user first
3. Create Bounty record:
   Bounty {
     id: "clx123abc...",
     title: "Implement OAuth2...",
     reward: 500,
     rewardToken: "USDC",
     status: OPEN,
     difficulty: INTERMEDIATE,
     category: "Backend",
     tags: ["OAuth", "TypeScript", "Security"],
     creatorId: "user123",
     createdAt: "2025-11-09T10:30:00Z"
   }
4. Log agent activity:
   AgentActivity {
     agentType: BOUNTY_CREATION,
     action: "CREATE_BOUNTY",
     description: "Created bounty: Implement OAuth2...",
     success: true
   }
5. Return bounty data to frontend
```

**Frontend Response:**

```typescript
6. Show success toast: "Bounty created successfully!"
7. Close dialog
8. Refresh page (window.location.reload())
9. New bounty appears in the list
```

---

## 👨‍💻 Contributor Flow

### Step 3B: Browsing Bounties

```
User navigates to /bounties
↓
Page loads with filters:
├── Search box (by title/description)
├── Status filter (Open | In Progress | Completed)
└── Category filter (Frontend | Backend | etc.)
```

**Data Flow:**

```typescript
// app/bounties/page.tsx

1. useEffect triggers on page load
2. Fetch bounties from API:
   GET /api/bounties?status=OPEN&category=Backend

3. Backend queries database:
   SELECT * FROM bounties
   WHERE status = 'OPEN'
   AND category = 'Backend'
   ORDER BY createdAt DESC

4. Return bounties with relationships:
   [
     {
       id: "clx123",
       title: "Implement OAuth2...",
       reward: 500,
       rewardToken: "USDC",
       status: "OPEN",
       creator: {
         username: "alice_dev",
         walletAddress: "7xKX...",
         reputationScore: 850
       },
       _count: {
         applications: 5  // Number of people who applied
       }
     }
   ]
```

**Display:**

```
Grid of bounty cards showing:
- Title
- Description (truncated)
- Reward amount with token badge
- Status badge (OPEN = green)
- Difficulty & Category badges
- Tags (first 3 shown)
- Creator info
- Application count
- "View Details" button
```

---

### Step 4: Applying to a Bounty

```
User finds interesting bounty
↓
Clicks "View Details"
↓
Navigates to /bounties/[id]  (to be implemented)
↓
Clicks "Apply to Bounty"
↓
Application form appears
```

**Application Form:**

```
📝 Message: "I have 5 years of experience with OAuth..."
🔗 GitHub PR URL: (optional for now, required when submitting)
```

**When user submits application:**

```typescript
POST /api/applications
Body: {
  bountyId: "clx123",
  applicantWalletAddress: "9pQs...Xyz",
  message: "I have 5 years..."
}

Backend:
1. Create user if doesn't exist
2. Check if already applied to this bounty
3. Create Application:
   Application {
     id: "app456",
     bountyId: "clx123",
     userId: "user789",
     message: "I have 5 years...",
     status: PENDING,
     createdAt: "2025-11-09T11:00:00Z"
   }
4. Update Bounty status to IN_PROGRESS
5. Return success
```

---

### Step 5: Submitting Work

```
Contributor completes the work
↓
Creates Pull Request on GitHub
↓
Returns to Forge platform
↓
Goes to "My Applications" section
↓
Enters PR URL
↓
Clicks "Submit for Review"
```

**Submission Process:**

```typescript
PATCH /api/applications/[id]
Body: {
  githubPrUrl: "https://github.com/owner/repo/pull/123",
  status: "SUBMITTED"
}

Backend:
1. Update Application:
   Application {
     ...existing fields,
     githubPrUrl: "https://github.com/owner/repo/pull/123",
     status: SUBMITTED,
     submittedAt: "2025-11-09T14:00:00Z"
   }
2. Send notification to bounty creator
3. Return updated application
```

---

## 🤖 AI Agent Automation

### Step 6: AI Evaluation (The Magic!)

This is where Forge's autonomous AI system kicks in:

```
Application status changes to SUBMITTED
↓
Creator (or system) triggers AI evaluation
↓
POST /api/applications/[id]/evaluate
Body: { pullRequestUrl: "https://github.com/..." }
```

**AI Evaluation Agent Process:**

```typescript
// app/api/applications/[id]/evaluate/route.ts

1. Fetch application and bounty data
2. Initialize CodeEvaluationAgent with Gemini API
3. Send evaluation request to Gemini Pro:

   Prompt to AI:
   """
   Evaluate this code submission for bounty:

   Bounty: "Implement OAuth2 Authentication"
   Description: "Add GitHub OAuth login..."
   Requirements: {
     codeQuality: "High",
     tests: "Required",
     documentation: "Yes"
   }

   Pull Request: https://github.com/owner/repo/pull/123

   Analyze:
   1. Code quality and best practices
   2. Security vulnerabilities
   3. Test coverage
   4. Documentation completeness
   5. Meets all requirements

   Return JSON:
   {
     approved: boolean,
     score: number (0-100),
     feedback: string,
     strengths: string[],
     weaknesses: string[]
   }
   """
```

**Gemini AI Response:**

```json
{
  "approved": true,
  "score": 85,
  "feedback": "Excellent implementation of OAuth2 with secure token handling. Code is well-structured and follows best practices. Minor improvements needed in error handling for edge cases.",
  "strengths": [
    "Clean, maintainable code structure",
    "Comprehensive test coverage (92%)",
    "Clear documentation with examples",
    "Proper error handling for common cases",
    "Security best practices followed"
  ],
  "weaknesses": [
    "Missing edge case for token refresh failure",
    "Could add more inline comments for complex logic"
  ]
}
```

**Automated Processing:**

```typescript
// lib/ai/code-evaluation-agent.ts

4. Parse AI response
5. Update Application:
   Application {
     ...existing,
     status: score >= 70 ? APPROVED : REJECTED,
     aiEvaluation: {
       approved: true,
       score: 85,
       feedback: "...",
       strengths: [...],
       weaknesses: [...]
     },
     evaluationScore: 85,
     evaluatedAt: "2025-11-09T14:05:00Z"
   }

6. If APPROVED (score >= 70):
   - Mark bounty as COMPLETED
   - Trigger payment process automatically

7. Log agent activity:
   AgentActivity {
     agentType: CODE_EVALUATION,
     action: "EVALUATE_SUBMISSION",
     description: "Evaluated PR #123 for bounty 'OAuth2' - Score: 85",
     metadata: { score: 85, approved: true },
     success: true
   }
```

---

### Step 7: Automatic Payment

When submission is approved (score >= 70), payment flows automatically:

```
AI approves submission
↓
Payment Agent activates
↓
POST /api/payments
```

**Payment Processing:**

```typescript
// app/api/payments/route.ts

1. Validate payment request:
   - Bounty must be COMPLETED
   - Application must be APPROVED
   - Payment not already processed

2. Verify Solana transaction:
   const verified = await solanaPaymentService.verifyTransaction(
     transactionHash,
     bountyReward,  // 500 USDC
     creatorWallet,
     contributorWallet
   )

3. If verified, create Payment record:
   Payment {
     id: "pay789",
     bountyId: "clx123",
     userId: "user789", // contributor
     amount: 500,
     token: "USDC",
     status: COMPLETED,
     transactionHash: "5Qx7...Abc123",
     protocol: "USDC",
     completedAt: "2025-11-09T14:10:00Z"
   }

4. Update contributor earnings:
   User {
     ...existing,
     totalEarned: 500
   }

5. Update application:
   Application {
     ...existing,
     status: PAID
   }

6. Update bounty:
   Bounty {
     ...existing,
     status: COMPLETED,
     completedAt: "2025-11-09T14:10:00Z"
   }

7. Update reputation (Reputation Agent):
   Reputation {
     userId: "user789",
     category: "bounty_completion",
     score: +10,
     reason: "Successfully completed bounty: OAuth2"
   }

   User {
     reputationScore: 10 (0 + 10)
   }

8. Log agent activity:
   AgentActivity {
     agentType: PAYMENT_PROCESSOR,
     action: "PROCESS_PAYMENT",
     description: "Paid 500 USDC to user789 for bounty clx123"
   }

9. Return payment confirmation
```

**Solana Transaction Details:**

```typescript
// lib/solana/payment-service.ts

The payment uses:
- Network: Solana Devnet
- Token: USDC (SPL Token)
- Mint Address: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
- From: Creator's wallet (escrow)
- To: Contributor's wallet
- Amount: 500 USDC
- Explorer: https://explorer.solana.com/tx/[hash]?cluster=devnet
```

---

### Step 8: Reputation Update

After payment completes:

```
Reputation Agent automatically:
1. Awards +10 reputation to contributor
2. Awards +5 reputation to creator (for creating quality bounty)
3. Checks for achievements:
   - First completion? → Award "First Blood" NFT
   - 10th completion? → Award "Veteran" badge
   - High score (>90)? → Award "Code Master" badge
4. Updates leaderboard rankings
```

**Reputation Calculation:**

```typescript
// Reputation scoring system

Base Points:
- Complete a bounty: +10
- Create a bounty: +5
- High-quality submission (score > 90): +5 bonus
- Fast completion (< 24 hours): +3 bonus
- Community engagement: +1-5

Penalties:
- Rejected submission: -2
- Late completion: -3
- Cancelled bounty: -5

Level System:
0-199:    Beginner    (Gray badge)
200-399:  Intermediate (Green badge)
400-599:  Advanced    (Blue badge)
600-799:  Expert      (Purple badge)
800-999:  Master      (Gold badge)
1000+:    Legend      (Diamond badge)
```

---

## 📊 Viewing Dashboard Data

### Agents Dashboard (/agents)

```
User navigates to /agents
↓
Page fetches real-time data:
GET /api/agents/activities
```

**Backend Query:**

```typescript
// app/api/agents/activities/route.ts

1. Query AgentActivity table:
   SELECT * FROM agent_activities
   ORDER BY createdAt DESC
   LIMIT 50

2. Group by agent type for stats:
   {
     activities: [
       {
         agentType: "CODE_EVALUATION",
         action: "EVALUATE_SUBMISSION",
         description: "Evaluated PR #123...",
         createdAt: "2 min ago"
       },
       {
         agentType: "PAYMENT_PROCESSOR",
         action: "PROCESS_PAYMENT",
         description: "Paid 500 USDC...",
         createdAt: "5 min ago"
       }
     ],
     stats: [
       { agentType: "CODE_EVALUATION", _count: 15 },
       { agentType: "PAYMENT_PROCESSOR", _count: 8 },
       { agentType: "REPUTATION_MANAGER", _count: 12 }
     ]
   }
```

**Display:**

- Real-time activity feed (like Twitter feed)
- Stats cards showing agent performance
- Filter by agent type
- Each activity shows: agent, action, description, timestamp

---

### Payments Dashboard (/payments)

```
User navigates to /payments
↓
GET /api/payments
```

**Backend:**

```typescript
// app/api/payments/route.ts

SELECT p.*, u1.username as payer_name, u2.username as receiver_name
FROM payments p
JOIN users u1 ON p.bountyId = (SELECT creatorId FROM bounties WHERE id = p.bountyId)
JOIN users u2 ON p.userId = u2.id
ORDER BY p.createdAt DESC
```

**Display:**

- Transaction history table
- Filters: All | SOL | USDC
- Each row shows:
  - From (payer)
  - To (receiver)
  - Amount with token badge
  - Related bounty
  - Status badge
  - Transaction link (to Solana Explorer)
  - Time ago

---

### Reputation Leaderboard (/reputation)

```
User navigates to /reputation
↓
GET /api/reputation/leaderboard?limit=50
```

**Backend:**

```typescript
// app/api/reputation/leaderboard/route.ts

SELECT u.*,
  COUNT(DISTINCT b.id) as bounties_created,
  COUNT(DISTINCT a.id) as applications_count,
  COUNT(DISTINCT ac.id) as achievements_count
FROM users u
LEFT JOIN bounties b ON b.creatorId = u.id
LEFT JOIN applications a ON a.userId = u.id
LEFT JOIN achievements ac ON ac.userId = u.id
GROUP BY u.id
ORDER BY u.reputationScore DESC
LIMIT 50
```

**Display:**

- Ranked table with trophy icons for top 3
- Each user shows:
  - Rank (#1, #2, #3...)
  - Avatar (generated from username/address)
  - Username or truncated wallet
  - Reputation score (big, bold)
  - Applications submitted
  - Bounties created
  - Total earned ($)
  - Achievements count
  - Level badge (Beginner → Legend)

---

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

1. LANDING
   User visits site → Homepage loads → Browse bounties
                                    ↓
2. CONNECT WALLET
   Click "Connect" → Select wallet → Approve → Connected ✓
                                                ↓
┌──────────────────────────────────┬──────────────────────────────┐
│     CREATOR PATH                 │     CONTRIBUTOR PATH          │
└──────────────────────────────────┴──────────────────────────────┘

3A. CREATE BOUNTY                   3B. BROWSE BOUNTIES
    Click "Create Bounty"               View list with filters
           ↓                                    ↓
    Fill form:                          Find interesting bounty
    - Title                                     ↓
    - Description                       4. APPLY TO BOUNTY
    - Reward                               Fill application form
    - Token (SOL/USDC)                     Add cover message
    - Difficulty                                ↓
    - Category                             Submit application
    - Tags                                      ↓
           ↓                               Status: PENDING
    Click "Create"                              ↓
           ↓                               5. WORK ON BOUNTY
    API: POST /api/bounties                Create PR on GitHub
           ↓                                    ↓
    DB: Insert Bounty                      6. SUBMIT WORK
        status: OPEN                          Enter PR URL
           ↓                                   Status: SUBMITTED
    Agent logs activity                         ↓
           ↓                          ┌────────┴────────┐
    Success! Bounty created           │  AI EVALUATION  │
           ↓                          └────────┬────────┘
    Page refreshes                             ↓
    New bounty appears          7. GEMINI AI ANALYZES CODE
           ↓                       - Code quality
    Wait for applications           - Security
           ↓                       - Tests
    Applications arrive             - Documentation
           ↓                               ↓
    Review (or let AI do it)        Returns score (0-100)
           ↓                               ↓
┌──────────┴──────────────────────────────┴──────────────────────┐
│                    AUTOMATION ZONE                               │
│                  (No human intervention)                         │
└──────────────────────────────────────────────────────────────────┘

8. AI DECISION
   Score >= 70? ──YES──→ Auto-approve ──→ 9. PAYMENT PROCESSING
        │                   ↓                      ↓
        NO                  Update:          Verify Solana TX
        │                   - Application    Transfer USDC
        ↓                     status: APPROVED     ↓
   Auto-reject              - Bounty         Create Payment record
   Send feedback              status: COMPLETED    ↓
        ↓                   - AI evaluation   Update user balance
   Application                visible              ↓
   status: REJECTED               ↓            10. REPUTATION UPDATE
                           Log activity           ↓
                                ↓              Award points (+10)
                           Trigger payment    Check achievements
                                                   ↓
                                              Update leaderboard
                                                   ↓
                                              Log activities
                                                   ↓
                                         ┌────────┴────────┐
                                         │   COMPLETED!    │
                                         └─────────────────┘

11. NOTIFICATIONS & DASHBOARDS
    - Creator sees: Bounty completed, payment sent
    - Contributor sees: Payment received, reputation +10
    - Both can view:
      * Transaction on Solana Explorer
      * AI evaluation feedback
      * Updated reputation scores
      * New achievements unlocked
```

---

## 🗄️ Database State Changes

### Initial State (New User)

```sql
User:
  walletAddress: "7xKXY...9pQs"
  username: null
  reputationScore: 0
  totalEarned: 0
```

### After Creating Bounty

```sql
Bounty:
  id: "clx123"
  title: "Implement OAuth2"
  reward: 500
  status: OPEN
  creatorId: "user123"

AgentActivity:
  agentType: BOUNTY_CREATION
  action: "CREATE_BOUNTY"
```

### After Application

```sql
Application:
  id: "app456"
  bountyId: "clx123"
  userId: "user789"
  status: PENDING

Bounty:
  status: IN_PROGRESS (updated)
```

### After AI Evaluation

```sql
Application:
  status: APPROVED
  aiEvaluation: {...}
  evaluationScore: 85

Bounty:
  status: COMPLETED

AgentActivity:
  agentType: CODE_EVALUATION
  action: "EVALUATE_SUBMISSION"
```

### After Payment

```sql
Payment:
  amount: 500
  token: "USDC"
  status: COMPLETED
  transactionHash: "5Qx7..."

User (contributor):
  totalEarned: 500
  reputationScore: 10

Application:
  status: PAID

Reputation:
  score: +10
  reason: "Completed bounty"

AgentActivity:
  agentType: PAYMENT_PROCESSOR
  action: "PROCESS_PAYMENT"

AgentActivity:
  agentType: REPUTATION_MANAGER
  action: "UPDATE_REPUTATION"
```

---

## 🎨 Frontend User Experience

### Visual Journey

1. **Homepage** (`/`)

   - Hero: "Autonomous Bounty Management"
   - Live stats cards (bounties, payments, users)
   - Featured bounties carousel
   - How it works section

2. **Bounties Page** (`/bounties`)

   - Grid of bounty cards
   - Search bar (live filtering)
   - Status/Category dropdowns
   - "Create Bounty" button (opens dialog)

3. **Agents Page** (`/agents`)

   - Agent stats dashboard
   - Activity feed (real-time)
   - Filter tabs (All | Evaluation | Payment | Reputation)
   - Each activity card shows icon, description, timestamp

4. **Payments Page** (`/payments`)

   - Stats cards (volume, transactions, success rate)
   - Transaction table
   - Filter tabs (All | SOL | USDC)
   - Link to Solana Explorer for each TX

5. **Reputation Page** (`/reputation`)
   - Stats overview
   - Leaderboard table
   - Trophy icons for top 3
   - Level badges
   - Info cards explaining system

---

## ⚡ Key Technical Highlights

### 1. Wallet-Based Authentication

- No email/password needed
- Wallet signature proves identity
- Auto-creates user on first action

### 2. AI-Powered Evaluation

- Google Gemini Pro API
- Structured JSON responses
- Scores 0-100 with detailed feedback
- Auto-approval at 70+ score

### 3. Solana Integration

- Devnet transactions
- SPL token support (USDC)
- Transaction verification
- Real blockchain records

### 4. Agent Automation

- No manual review needed
- Instant evaluation
- Automatic payments
- Reputation management

### 5. Real-Time Updates

- Live activity feeds
- Dynamic statistics
- Instant notifications (toasts)
- Database triggers

---

## 🎯 Summary

**The complete flow in 30 seconds:**

1. User connects Solana wallet
2. Creates bounty with reward
3. Contributor applies and submits PR
4. AI evaluates code automatically
5. If score >= 70: Auto-approve
6. Payment processes automatically
7. Reputation updates
8. Everyone sees updates in dashboards

**Zero manual intervention needed!** 🤖✨

The entire bounty lifecycle is managed by AI agents, with full transparency on the blockchain and real-time visibility through beautiful dashboards.
