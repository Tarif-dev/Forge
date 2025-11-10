# 🏗️ Architecture Deep Dive - What Each Track Really Does

## Table of Contents

1. [API Routes (Backend Tracks)](#api-routes-backend-tracks)
2. [AI Agent System](#ai-agent-system)
3. [Solana Payment Service](#solana-payment-service)
4. [Database Models](#database-models)
5. [Frontend Components](#frontend-components)

---

## 🛣️ API Routes (Backend Tracks)

### 1. **Bounty Management Routes** (`/api/bounties`)

#### `GET /api/bounties`

**What it does:**

- Fetches all bounties from the database with optional filtering
- Returns bounties with creator details and application counts

**Accepts:**

- `status` query param (e.g., `?status=ACTIVE`) - Filter by ACTIVE, COMPLETED, CANCELLED
- `category` query param (e.g., `?category=Backend`) - Filter by Smart Contract, Backend, Frontend, etc.
- `difficulty` query param (e.g., `?difficulty=INTERMEDIATE`)

**Returns:**

```json
[
  {
    "id": "uuid",
    "title": "Build DeFi Dashboard",
    "description": "Need a React dashboard...",
    "reward": 50,
    "rewardToken": "SOL",
    "status": "ACTIVE",
    "difficulty": "INTERMEDIATE",
    "category": "Frontend",
    "tags": ["react", "defi"],
    "creator": {
      "username": "devmaster",
      "walletAddress": "7xKX..."
    },
    "_count": {
      "applications": 3
    }
  }
]
```

#### `POST /api/bounties`

**What it does:**

1. Validates required fields (title, description, reward, etc.)
2. Finds existing user by wallet address OR creates new user automatically
3. Creates new bounty in database
4. Logs "BOUNTY_CREATION" activity for tracking
5. Returns the created bounty with all relationships

**Expects:**

```json
{
  "title": "Fix bug in smart contract",
  "description": "The withdraw function...",
  "reward": 25,
  "rewardToken": "USDC",
  "difficulty": "ADVANCED",
  "category": "Smart Contract",
  "requirements": "Must write tests",
  "tags": ["solidity", "security"],
  "walletAddress": "7xKXy..."
}
```

**Why it matters:**

- This is what fires when you click "Create Bounty" in the dialog
- Auto-creates users so you don't need separate registration
- Immediately makes bounty visible to all contributors

---

#### `GET /api/bounties/[id]`

**What it does:**

- Fetches a SINGLE bounty with ALL related data
- Includes creator profile, all applications, and payment records

**Returns:**

```json
{
  "id": "bounty-uuid",
  "title": "Build NFT Marketplace",
  "creator": { "username": "...", "reputationScore": 85 },
  "applications": [
    {
      "id": "app-uuid",
      "message": "I can do this!",
      "status": "SUBMITTED",
      "user": { "username": "contributor1" }
    }
  ],
  "payments": []
}
```

**Why it matters:**

- Powers the bounty detail page
- Shows who applied and their status
- Displays payment history if bounty is completed

---

#### `PATCH /api/bounties/[id]`

**What it does:**

- Updates bounty status (ACTIVE → COMPLETED)
- Sets escrow address after payment
- Automatically sets completedAt timestamp when status becomes COMPLETED
- Logs "BOUNTY_UPDATED" activity

**Expects:**

```json
{
  "status": "COMPLETED",
  "escrowAddress": "EscrowPubkey..."
}
```

---

#### `DELETE /api/bounties/[id]`

**What it does:**

- Doesn't actually delete - just marks as CANCELLED
- Logs "BOUNTY_CANCELLED" activity

**Why soft delete:**

- Preserves history for analytics
- Shows users their past cancelled bounties
- Maintains data integrity for applications

---

### 2. **Application Management Routes** (`/api/applications`)

#### `POST /api/applications`

**What it does:**

1. Validates bountyId, walletAddress, message
2. Auto-creates user if they don't exist
3. Checks for duplicate applications (prevents spam)
4. Creates application record
5. Logs "APPLICATION_CREATED" activity
6. Returns application with user and bounty details

**Expects:**

```json
{
  "bountyId": "uuid",
  "walletAddress": "7xKXy...",
  "message": "I've built similar projects...",
  "githubPrUrl": "https://github.com/user/repo/pull/123"
}
```

**Returns:**

```json
{
  "id": "app-uuid",
  "status": "SUBMITTED",
  "message": "I've built...",
  "user": {
    "username": "contributor",
    "reputationScore": 75
  },
  "bounty": {
    "title": "Build DeFi Dashboard",
    "reward": 50
  }
}
```

**Why it matters:**

- This is what fires when contributor clicks "Apply to Bounty"
- Creates link between user and bounty
- Stores their PR URL for evaluation

---

#### `GET /api/applications`

**What it does:**

- Fetches applications with optional filters
- Can filter by bounty OR by user's wallet

**Query params:**

- `?bountyId=uuid` - Get all applications for a specific bounty
- `?walletAddress=7xKXy...` - Get all applications by a user

**Why it matters:**

- Creators see who applied to their bounties
- Contributors see their application history

---

#### `POST /api/applications/[id]/evaluate`

**What it does:** ⭐ **MOST IMPORTANT TRACK - AI AUTOMATION**

1. Fetches application with bounty and user details
2. Validates GitHub PR URL exists
3. **Calls AI Agent** to evaluate the code submission
4. Updates application with:
   - AI evaluation results (approved, score, feedback, strengths, weaknesses)
   - Evaluation score (0-100)
   - Status (APPROVED if score ≥ 70, otherwise stays SUBMITTED)
   - Evaluated timestamp
5. Logs "EVALUATION_COMPLETED" activity
6. **If approved and score ≥ 70:**
   - Marks bounty as COMPLETED
   - Logs "BOUNTY_COMPLETED" activity

**What AI evaluates:**

- Does the PR meet bounty requirements?
- Code quality and best practices
- Test coverage
- Documentation
- Security considerations

**Returns:**

```json
{
  "application": {
    "id": "app-uuid",
    "status": "APPROVED",
    "evaluationScore": 85,
    "aiEvaluation": {
      "approved": true,
      "score": 85,
      "feedback": "Excellent implementation...",
      "strengths": ["Clean code structure", "Comprehensive tests"],
      "weaknesses": ["Missing error handling in one function"],
      "recommendations": ["Add try-catch block in processPayment()"]
    }
  },
  "evaluation": {
    /* same as aiEvaluation */
  }
}
```

**Why it matters:**

- **THIS IS THE AI MAGIC** - automatic code review
- No need for manual review (saves creators hours)
- Fair evaluation based on objective criteria
- Instant feedback to contributors

---

### 3. **Payment Processing Routes** (`/api/payments`)

#### `POST /api/payments`

**What it does:** 💰 **BLOCKCHAIN INTEGRATION**

1. Accepts bountyId, winnerId, transactionSignature
2. Fetches bounty and winner details
3. **Verifies transaction on Solana blockchain** (actual on-chain verification)
4. Creates payment record in database
5. Updates winner's totalEarned
6. Marks application as PAID
7. Marks bounty as COMPLETED
8. Logs "PAYMENT_COMPLETED" activity
9. **Awards reputation points** (+10 to winner)
10. Creates reputation record

**Expects:**

```json
{
  "bountyId": "uuid",
  "winnerId": "user-uuid",
  "transactionSignature": "5kF7g...actual-solana-signature"
}
```

**On-chain verification:**

- Calls Solana RPC to check transaction status
- Only accepts "confirmed" or "finalized" transactions
- Prevents fake transactions

**Returns:**

```json
{
  "success": true,
  "payment": {
    "id": "payment-uuid",
    "amount": 50,
    "token": "SOL",
    "status": "COMPLETED",
    "transactionHash": "5kF7g...",
    "protocol": "SOLANA"
  },
  "message": "Payment processed successfully"
}
```

**Why it matters:**

- **BRIDGES BLOCKCHAIN TO DATABASE** - connects real Solana payments to app
- Trustless verification (can't fake on-chain transactions)
- Awards reputation automatically
- Tracks earnings for leaderboard

---

#### `GET /api/payments`

**What it does:**

- Fetches payment history with filters

**Query params:**

- `?userId=uuid` - Get all payments to a user
- `?bountyId=uuid` - Get payments for a bounty

---

### 4. **Agent Activity Routes** (`/api/agents/activities`)

#### `GET /api/agents/activities`

**What it does:**

- Fetches AI agent activity logs
- Shows what agents have been doing

**Query params:**

- `?agentType=CODE_EVALUATION` - Filter by agent type
- `?limit=50` - Limit number of results

**Returns:**

```json
{
  "activities": [
    {
      "id": "activity-uuid",
      "agentType": "CODE_EVALUATION",
      "action": "EVALUATION_COMPLETED",
      "description": "AI evaluated submission for 'Build DeFi Dashboard'",
      "success": true,
      "metadata": {
        "applicationId": "app-uuid",
        "score": 85,
        "approved": true
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "stats": [
    { "agentType": "CODE_EVALUATION", "count": 42 },
    { "agentType": "PAYMENT_PROCESSOR", "count": 28 },
    { "agentType": "BOUNTY_CREATION", "count": 156 }
  ]
}
```

**Why it matters:**

- **TRANSPARENCY** - Users see what AI is doing
- Debug tool for developers
- Trust building (shows AI activity is legitimate)

---

### 5. **Reputation Routes** (`/api/reputation/leaderboard`)

#### `GET /api/reputation/leaderboard`

**What it does:**

- Fetches top users by reputation score
- Includes stats on bounties, applications, achievements

**Query params:**

- `?limit=100` - Top N users (default 100)

**Returns:**

```json
[
  {
    "id": "user-uuid",
    "username": "topcontributor",
    "walletAddress": "7xKXy...",
    "reputationScore": 250,
    "totalEarned": 450,
    "_count": {
      "applications": 15,
      "createdBounties": 3,
      "achievements": 7
    }
  }
]
```

**Why it matters:**

- Gamification - encourages participation
- Shows most active/skilled users
- Powers reputation page

---

### 6. **User Profile Routes** (`/api/users/[walletAddress]`)

#### `GET /api/users/[walletAddress]`

**What it does:**

- Fetches user profile by wallet address
- **Auto-creates user if doesn't exist** (important!)
- Includes all bounties created, applications, achievements, reputation history

**Returns:**

```json
{
  "id": "user-uuid",
  "walletAddress": "7xKXy...",
  "username": "devmaster",
  "reputationScore": 150,
  "totalEarned": 300,
  "createdBounties": [{ "title": "Build NFT Marketplace", "reward": 100 }],
  "applications": [{ "bounty": { "title": "Fix bug" }, "status": "APPROVED" }],
  "achievements": [],
  "reputation": [{ "category": "bounty_completion", "score": 10 }]
}
```

**Why it matters:**

- Profile pages
- **Frictionless onboarding** - just connect wallet, user is created
- Shows user's complete history

---

#### `PATCH /api/users/[walletAddress]`

**What it does:**

- Updates user profile (username, email, GitHub, avatar, bio)

**Expects:**

```json
{
  "username": "newname",
  "email": "user@example.com",
  "githubUsername": "devmaster",
  "avatarUrl": "https://...",
  "bio": "Web3 developer..."
}
```

---

## 🤖 AI Agent System

### **CodeEvaluationAgent** (`lib/ai/code-evaluation-agent.ts`)

#### What it is:

A Google Gemini Pro-powered AI that acts as an automated code reviewer.

#### Methods:

##### 1. `evaluateSubmission()`

**Purpose:** Automatically review code submissions

**Input:**

- `bountyTitle`: "Build DeFi Dashboard"
- `bountyRequirements`: "Must use React, TypeScript, connect to Phantom wallet..."
- `prUrl`: "https://github.com/..."
- `prDescription`: "I implemented all features..."
- `diffContent`: (optional) actual code diff

**What it does:**

1. Constructs prompt with bounty context
2. Sends to Gemini Pro API
3. Requests structured JSON response
4. Parses AI response
5. Validates response format
6. Returns evaluation OR fallback if AI fails

**Output:**

```typescript
{
  approved: true,
  score: 85,
  feedback: "Excellent implementation with clean code...",
  strengths: [
    "Well-structured React components",
    "Comprehensive TypeScript types"
  ],
  weaknesses: [
    "Missing error handling in API calls"
  ],
  recommendations: [
    "Add try-catch blocks around fetch calls",
    "Consider adding loading states"
  ]
}
```

**Fallback behavior:**

- If AI errors, returns score: 50, approved: false
- Recommends manual review
- Logs error to console

---

##### 2. `generateBountyDescription()`

**Purpose:** Auto-generate bounty descriptions

**Input:**

```typescript
title: "Build NFT Marketplace",
category: "Frontend",
techStack: ["React", "Next.js", "Solana Web3.js"]
```

**Output:**
A professional 150-200 word description with:

- What needs to be built
- Key requirements
- Technical specifications
- Acceptance criteria

**Why it matters:**

- Helps creators write better bounties
- Ensures consistency
- Saves time

---

##### 3. `suggestBountyReward()`

**Purpose:** Calculate fair reward amount

**Input:**

```typescript
difficulty: "INTERMEDIATE",
estimatedHours: 8,
category: "Smart Contract"
```

**Algorithm:**

```typescript
baseRates = {
  BEGINNER: $25/hour,
  INTERMEDIATE: $50/hour,
  ADVANCED: $75/hour,
  EXPERT: $100/hour
}

categoryMultipliers = {
  "Smart Contract": 1.5x,  // Higher pay for security-critical work
  "Backend": 1.2x,
  "Frontend": 1.0x,
  "UI/UX": 0.9x,
  "DevOps": 1.3x
}

reward = baseRate × estimatedHours × categoryMultiplier
```

**Example:**

- INTERMEDIATE (50) × 8 hours × 1.5 (Smart Contract) = **$600 equivalent in SOL**

---

## 💳 Solana Payment Service

### **SolanaPaymentService** (`lib/solana/payment-service.ts`)

#### What it is:

Handles all blockchain interactions with Solana devnet.

#### Configuration:

- **Network:** Solana Devnet
- **RPC:** `https://api.devnet.solana.com`
- **USDC Mint:** `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr` (devnet address)

#### Methods:

##### 1. `createPaymentTransaction()`

**Purpose:** Create unsigned transaction for bounty payment

**How it works:**

**For SOL payments:**

```typescript
SystemProgram.transfer({
  fromPubkey: creator.wallet,
  toPubkey: winner.wallet,
  lamports: 50 * LAMPORTS_PER_SOL, // 50 SOL
});
```

**For USDC payments:**

```typescript
// 1. Get token accounts for both users
fromTokenAccount = getAssociatedTokenAddress(USDC_MINT, creator.wallet);
toTokenAccount = getAssociatedTokenAddress(USDC_MINT, winner.wallet);

// 2. Create transfer instruction
createTransferInstruction(
  fromTokenAccount,
  toTokenAccount,
  creator.wallet,
  50 * 1e6 // USDC has 6 decimals, so 50 USDC = 50,000,000
);
```

**Returns:** Unsigned Transaction object (user signs in browser)

---

##### 2. `createEscrowAccount()`

**Purpose:** Create escrow account that holds bounty funds

**How it works:**

1. Generates new Keypair (escrow account)
2. Creates transaction to initialize escrow account
3. Transfers bounty amount to escrow
4. Returns escrow keypair and unsigned transaction

**Why escrow:**

- Trustless payments (funds locked until completion)
- Prevents creator from backing out
- On-chain proof of funds

**Example flow:**

```
Creator creates bounty → Funds go to escrow →
Contributor completes work →
AI approves →
Escrow releases funds to contributor
```

---

##### 3. `releaseEscrow()`

**Purpose:** Release escrowed funds to winner

**How it works:**

```typescript
SystemProgram.transfer({
  fromPubkey: escrowAccount,
  toPubkey: winner.wallet,
  lamports: bountyAmount,
});
```

**Called after:**

- Application is APPROVED
- Winner is selected

---

##### 4. `verifyTransaction()`

**Purpose:** Verify transaction actually happened on-chain

**How it works:**

1. Calls Solana RPC: `getSignatureStatus(signature)`
2. Checks confirmation status
3. Returns true if "confirmed" or "finalized"

**Why it matters:**

- **PREVENTS FRAUD** - can't fake blockchain transactions
- Trustless verification
- Database only records verified payments

**Example:**

```typescript
// User claims they paid
const signature = "5kF7g2x...";

// We verify on-chain
const verified = await verifyTransaction(signature);

if (verified) {
  // Create payment record in database
} else {
  // Reject - transaction not found or unconfirmed
}
```

---

##### 5. `getBalance()` and `getUSDCBalance()`

**Purpose:** Check wallet balances

**SOL balance:**

```typescript
balance = await connection.getBalance(pubkey);
return balance / LAMPORTS_PER_SOL; // Convert to SOL
```

**USDC balance:**

```typescript
tokenAccount = await getAssociatedTokenAddress(USDC_MINT, pubkey);
balance = await connection.getTokenAccountBalance(tokenAccount);
return parseFloat(balance.value.uiAmountString);
```

**Why it matters:**

- Check if user has enough funds before bounty creation
- Display balances in UI

---

## 🗄️ Database Models

### **1. User**

**Purpose:** Stores user profiles and stats

**Key fields:**

- `walletAddress` (unique) - Solana wallet (primary identifier)
- `reputationScore` - Gamification score
- `totalEarned` - Total bounty rewards earned

**Relationships:**

- `createdBounties[]` - Bounties they created
- `applications[]` - Bounties they applied to
- `achievements[]` - Badges earned
- `reputation[]` - Reputation history

**Auto-creation:**

- Created automatically on first wallet connection
- No manual registration needed

---

### **2. Bounty**

**Purpose:** Core bounty data

**Key fields:**

- `title`, `description`, `requirements`
- `reward`, `rewardToken` (SOL or USDC)
- `status` (DRAFT, ACTIVE, IN_PROGRESS, COMPLETED, CANCELLED)
- `difficulty` (BEGINNER to EXPERT)
- `category` (Smart Contract, Backend, etc.)
- `escrowAddress` - Solana escrow account pubkey

**Relationships:**

- `creator` - User who created it
- `applications[]` - All submissions
- `payments[]` - Payment records

**Lifecycle:**

```
DRAFT → ACTIVE (published) →
IN_PROGRESS (someone working) →
COMPLETED (paid) or CANCELLED
```

---

### **3. Application**

**Purpose:** Links contributors to bounties

**Key fields:**

- `message` - Cover letter
- `githubPrUrl` - Link to PR
- `status` (SUBMITTED, APPROVED, REJECTED, PAID)
- `aiEvaluation` - JSON of AI evaluation results
- `evaluationScore` - 0-100 score

**Relationships:**

- `user` - Applicant
- `bounty` - Target bounty

**Flow:**

```
User applies (SUBMITTED) →
AI evaluates →
APPROVED (score ≥ 70) →
PAID (after transaction)
```

---

### **4. Payment**

**Purpose:** Records blockchain payments

**Key fields:**

- `amount`, `token` (SOL/USDC)
- `transactionHash` - Solana signature
- `status` (PENDING, COMPLETED, FAILED)
- `protocol` - "SOLANA"
- `metadata` - Escrow address, network info

**Relationships:**

- `user` - Payment recipient
- `bounty` - Related bounty

**Why separate from Bounty:**

- Can have multiple payments (disputes, partial payments)
- Track payment history independently
- Link to blockchain transaction

---

### **5. AgentActivity**

**Purpose:** Log all AI agent actions (transparency + debugging)

**Key fields:**

- `agentType` (CODE_EVALUATION, PAYMENT_PROCESSOR, BOUNTY_CREATION, COMMUNICATION)
- `action` (EVALUATION_COMPLETED, PAYMENT_COMPLETED, etc.)
- `description` - Human-readable summary
- `success` - Did it work?
- `metadata` - Related IDs, scores, etc.

**Why it matters:**

- **Transparency** - Users see AI is working
- **Debugging** - Track failures
- **Analytics** - How often are agents running?

---

### **6. Reputation**

**Purpose:** Track reputation changes over time

**Key fields:**

- `category` (bounty_completion, quality_code, community_help)
- `score` - Points earned (+10, -5, etc.)
- `reason` - "Completed bounty: Build NFT Marketplace"
- `metadata` - Related IDs

**Relationships:**

- `user` - Who earned/lost reputation

**Score calculation:**

```typescript
user.reputationScore = sum of all reputation.score
```

---

### **7. Achievement**

**Purpose:** Gamification badges

**Key fields:**

- `name` - "First Bounty", "10x Contributor"
- `description` - "Complete your first bounty"
- `badgeUrl` - Image URL
- `unlockedAt` - When earned

**Relationships:**

- `user` - Who earned it

**Examples:**

- "First Bounty" - Complete 1 bounty
- "Rising Star" - Reach 100 reputation
- "Code Master" - Get 5 perfect AI evaluations (score 100)

---

## 🎨 Frontend Components

### **CreateBountyDialog** (`components/create-bounty-dialog.tsx`)

**Purpose:** Modal form for creating bounties

**What it does:**

1. Checks wallet connection
2. Shows form with fields:
   - Title (text)
   - Description (textarea)
   - Requirements (textarea)
   - Reward (number)
   - Token (SOL/USDC select)
   - Difficulty (select)
   - Category (select)
   - Tags (comma-separated)
3. Validates all required fields
4. Submits to `POST /api/bounties`
5. Shows toast notification
6. Refreshes bounty list

**Key features:**

- Real-time validation
- Wallet connection check (must connect first)
- Error handling with toast messages
- Responsive design

---

### **Page Components**

#### `/app/bounties/page.tsx`

**Purpose:** Bounty marketplace

**What it shows:**

- List of all bounties
- Filter buttons (All, Active, Completed)
- Category filter
- Each bounty card shows:
  - Title, description
  - Reward amount
  - Difficulty badge
  - Creator info
  - Application count

**Data source:** `GET /api/bounties`

---

#### `/app/agents/page.tsx`

**Purpose:** AI agent dashboard

**What it shows:**

- Agent activity timeline
- Stats by agent type
- Real-time agent actions

**Data source:** `GET /api/agents/activities`

---

#### `/app/payments/page.tsx`

**Purpose:** Payment history

**What it shows:**

- All completed payments
- Transaction details
- Links to Solana Explorer

**Data source:** `GET /api/payments`

---

#### `/app/reputation/page.tsx`

**Purpose:** Leaderboard

**What it shows:**

- Top users by reputation
- Stats (bounties, applications, earnings)
- Rank numbers

**Data source:** `GET /api/reputation/leaderboard`

---

## 🔄 How Everything Connects

### **Example: Complete Bounty Lifecycle**

1. **Creator creates bounty**

   - Frontend: `CreateBountyDialog` → `POST /api/bounties`
   - Backend: Auto-create user, create bounty, log activity
   - Database: User + Bounty + AgentActivity records

2. **Contributor applies**

   - Frontend: Apply button → `POST /api/applications`
   - Backend: Auto-create user, create application, log activity
   - Database: Application record

3. **AI evaluates submission**

   - Frontend: Evaluate button → `POST /api/applications/[id]/evaluate`
   - Backend:
     - Fetch application
     - **Call CodeEvaluationAgent.evaluateSubmission()**
     - AI analyzes code
     - Update application with results
     - If approved → mark bounty COMPLETED
   - Database: Application updated, AgentActivity logged

4. **Payment processed**

   - Frontend: User signs transaction in wallet
   - Blockchain: Transaction confirmed on Solana
   - Frontend: `POST /api/payments` with signature
   - Backend:
     - **Call solanaPaymentService.verifyTransaction()**
     - Verify on-chain
     - Create payment record
     - Update user.totalEarned
     - Award reputation (+10)
   - Database: Payment + Reputation records

5. **Leaderboard updates**
   - Frontend: Visit `/reputation` → `GET /api/reputation/leaderboard`
   - Backend: Query users ordered by reputationScore
   - Display: Top contributors ranked

---

## 🎯 Summary: What Each "Track" Does

| Track                    | Purpose                | Key Function                                           |
| ------------------------ | ---------------------- | ------------------------------------------------------ |
| **Bounty Routes**        | CRUD for bounties      | Create, list, filter, update bounties                  |
| **Application Routes**   | Submission management  | Apply, list applications, AI evaluation                |
| **Payment Routes**       | Blockchain integration | Verify transactions, record payments, award reputation |
| **Agent Routes**         | AI transparency        | Log and display agent activities                       |
| **Reputation Routes**    | Gamification           | Leaderboard, reputation tracking                       |
| **User Routes**          | Profile management     | Get/update user profiles, auto-creation                |
| **CodeEvaluationAgent**  | AI code review         | Auto-evaluate submissions with Gemini Pro              |
| **SolanaPaymentService** | Blockchain ops         | Create transactions, escrow, verify on-chain           |
| **Database Models**      | Data persistence       | Store all data with relationships                      |
| **Frontend Components**  | User interface         | Forms, lists, dashboards, interactions                 |

---

## 🚀 The Magic: What Makes This Special

1. **Frictionless Onboarding**

   - Just connect wallet → user created automatically
   - No registration forms

2. **AI Automation**

   - Code evaluation in seconds (not hours)
   - Fair, objective scoring
   - Detailed feedback for improvement

3. **Blockchain Trust**

   - On-chain payment verification (can't fake)
   - Escrow for security
   - Transparent transactions

4. **Gamification**

   - Reputation system
   - Achievements
   - Leaderboard

5. **Full Transparency**
   - Agent activity logs
   - Payment history
   - All actions recorded

---

**Need more details on any specific track? Let me know!** 🎉
