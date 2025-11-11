# 🎯 Forge - Complete Demo Flow

## Overview

This document outlines the complete workflow for demonstrating the Forge platform, highlighting the use of **x402 Protocol**, **Phantom CASH**, and **AgentPay** integrations.

---

## 🚀 Demo Workflow (Step-by-Step)

### **Step 1: Creator Creates a Bounty** 👨‍💼

**Page:** `/bounties` → Click "Create Bounty"

1. Creator connects their wallet (Phantom/Solflare)
2. Fills in bounty details:
   - **Title**: "Implement OAuth2 Authentication"
   - **Description**: Detailed requirements
   - **Reward**: 500 USDC
   - **Difficulty**: INTERMEDIATE
   - **Category**: Backend
   - **Tags**: TypeScript, OAuth2, Security
3. **🤖 KEY DEMO POINT - Payment Protocol Selection:**
   - Select **"x402 Autonomous"** payment protocol
   - Set **Auto-Pay Score Threshold** to 70
   - **Explain**: "With x402, the AI agent will automatically evaluate submissions and pay contributors when they score ≥ 70"
4. Optional: Add GitHub repo/issue URLs
5. Click "Create Bounty"

**What Happens Behind the Scenes:**

- Bounty stored in database
- Payment protocol (x402) assigned
- Auto-pay threshold configured
- AgentActivity logged for AI tracking

---

### **Step 2: Contributor Discovers Bounty** 👩‍💻

**Page:** `/bounties`

1. Contributor browses available bounties
2. Sees the bounty with:
   - 🤖 **"x402 Autonomous"** badge (indicating AI auto-payment)
   - Reward amount
   - Difficulty level
   - Tags
3. Clicks "View Details"

**Page:** `/bounties/[id]`

**What They See:**

- Full bounty description
- Requirements
- **Payment Protocol**: x402 Autonomous (AI agent pays automatically)
- **Auto-Pay Threshold**: ≥ 70
- GitHub links (if provided)
- Creator info
- Applications count

---

### **Step 3: Contributor Applies** ✍️

**Page:** `/bounties/[id]` → Click "Apply to Bounty"

1. Application dialog opens
2. Contributor fills in:
   - **Message**: Their pitch and relevant experience
   - **GitHub URL** (optional): Link to portfolio/previous work
3. Clicks "Submit Application"

**What Happens:**

- Application created with status: **PENDING**
- User record created/updated
- AgentActivity logged: "APPLICATION_CREATED"
- Toast notification: "Application submitted!"
- Application appears in bounty's Applications table

---

### **Step 4: Creator Reviews Applications** 🔍

**Page:** `/my-bounties` (NEW PAGE!)

**What Creator Sees:**

- **Dashboard with stats**:
  - Total Bounties
  - Active Bounties
  - Pending Applications (highlighted!)
- **List of their bounties** with:

  - Bounty title, reward, status
  - 🤖 **x402 Auto-Pay** badge
  - Number of applications
  - "View Bounty" link

- **Applications Table** showing:
  - Applicant name/wallet
  - Status (PENDING, APPROVED, REJECTED, PAID)
  - AI Evaluation Score (if evaluated)
  - Applied date
  - **Action buttons**: View | Approve | Reject

---

### **Step 5: Creator Approves Application** ✅

**🎬 THIS IS THE MAGIC MOMENT FOR THE DEMO!**

1. Creator clicks **"View"** to see application details:

   - Applicant's message
   - GitHub profile
   - Reputation score

2. Creator clicks **"Approve"** button

**What Happens (DEMONSTRATE THESE STEPS):**

#### **A. AI Code Evaluation Agent Activated** 🤖

- **Tool Used**: Google Gemini Pro AI
- Endpoint: `/api/applications/[id]/evaluate`
- Agent analyzes:
  - Code quality
  - Completeness
  - Best practices
  - Documentation
- **Generates evaluation score** (0-100)

#### **B. x402 Protocol Payment Processing** 💰

**🌟 KEY SPONSOR INTEGRATION - x402 Protocol**

```typescript
// If score >= autoPayThreshold (e.g., 70)
if (evaluationScore >= bounty.autoPayThreshold) {
  // x402 AUTONOMOUS PAYMENT TRIGGERED
  await x402PaymentProcessor.processPayment({
    from: creator.walletAddress,
    to: applicant.walletAddress,
    amount: bounty.reward,
    protocol: "X402",
  });

  status = "PAID"; // Automatically marked as paid!
}
```

**What This Demonstrates:**

- ✅ **Agent-to-agent** autonomous payment
- ✅ **No manual intervention** required
- ✅ **Trust through AI evaluation**
- ✅ **x402 protocol** handling the transaction

#### **C. Alternative: Phantom CASH Protocol** ⚡

If bounty uses **CASH** protocol instead:

- **Ultra-low fees** (0.05%)
- Instant settlement
- Phantom wallet integration

#### **D. AgentPay for Evaluation API Costs** 💳

**🌟 KEY SPONSOR INTEGRATION - AgentPay**

```typescript
// AI agent pays for its own API usage
await agentPayService.processPayment({
  agentType: "CODE_EVALUATION",
  apiCost: geminiApiCost,
  protocol: "AgentPay",
});
```

**What This Demonstrates:**

- ✅ **Agents pay for their own API usage**
- ✅ **Micropayments** for AI inference
- ✅ **Autonomous budgeting**

---

### **Step 6: Toast Notification Shows Results** 🎉

Creator sees success toast:

```
✅ Application Approved!
AI Evaluation Score: 85/100
🤖 x402 processed payment automatically!
```

**Application Status Updates:**

- Status: PENDING → APPROVED → **PAID**
- Evaluation Score: **85/100** displayed
- Payment transaction recorded

---

### **Step 7: Contributor Gets Paid** 💸

**Automatic Updates:**

- Contributor's wallet receives payment (via x402)
- Application status shows: **PAID** ✅
- Reputation score increases
- Total earnings updated
- Achievement NFTs awarded (if milestones hit)

---

## 🎯 Key Demo Talking Points

### **1. x402 Protocol Integration** 🤖

- **Autonomous agent-to-agent payments**
- AI evaluates code quality
- Automatic payment when threshold met
- No manual approval needed
- Trust through AI verification

### **2. Phantom CASH Integration** ⚡

- **Ultra-low transaction fees** (0.05%)
- Fast settlement
- Alternative to traditional SOL/USDC
- Ideal for microtransactions

### **3. AgentPay Integration** 💳

- **Agents pay for their own API usage**
- Google Gemini API costs covered by agent
- Micropayments for AI inference
- Autonomous budget management

### **4. Multi-Protocol Support** 🔄

Creators can choose:

- **x402**: AI autonomous payments
- **CASH**: Ultra-low fees
- **SOL**: Traditional Solana
- **USDC**: Stablecoin

---

## 📊 Architecture Highlights

```
┌─────────────┐
│   Creator   │ Creates Bounty (x402 enabled)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Bounty (Database)  │ Payment Protocol: x402
│  Auto-Pay: ≥ 70     │ Threshold: 70
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│ Contributor │ Submits Application
└──────┬──────┘
       │
       ▼
┌────────────────────────┐
│  Creator Approves      │ → Triggers Evaluation
└──────┬─────────────────┘
       │
       ▼
┌─────────────────────────┐
│ AI Evaluation Agent     │ Gemini Pro API
│ (CODE_EVALUATION)       │ AgentPay → Pays API Cost
└──────┬──────────────────┘
       │
       ▼ Score: 85/100
┌─────────────────────────┐
│ x402 Payment Processor  │ Score ≥ 70 ✓
│ Autonomous Payment      │ AUTO-PAY TRIGGERED
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│ Contributor │ 💰 PAID! Status: PAID
└─────────────┘
```

---

## 🎬 Demo Script

### **Opening (1 min)**

"Forge is an autonomous bounty management platform where AI agents handle the entire lifecycle - from evaluation to payment."

### **Bounty Creation (2 min)**

1. "First, I'll create a bounty as a project maintainer"
2. "Notice the x402 payment protocol - this enables autonomous AI payments"
3. "I set the auto-pay threshold to 70, meaning anyone scoring 70+ gets paid automatically"

### **Application Process (2 min)**

1. "As a contributor, I browse bounties and find one I like"
2. "I submit my application with my pitch and GitHub profile"
3. "My application is now visible to the creator"

### **The Magic - Approval & Payment (3 min)**

1. "Creator reviews my application on the 'My Bounties' page"
2. "They click Approve, which triggers our AI evaluation agent"
3. **Point 1**: "The agent uses Google Gemini Pro to evaluate code quality"
4. **Point 2**: "AgentPay handles the API costs - the agent pays for itself!"
5. **Point 3**: "My score is 85/100, above the 70 threshold"
6. **Point 4**: "x402 protocol automatically processes the payment"
7. "No manual transaction needed - fully autonomous!"

### **Closing (2 min)**

"This demonstrates three key innovations:

1. **x402**: Autonomous agent payments
2. **AgentPay**: Agents funding their own operations
3. **Phantom CASH**: Ultra-low fee alternative
   All working together to create trustless, automated bounty management."

---

## 🔑 Key URLs for Demo

1. **Home**: `http://localhost:3000/`
2. **Browse Bounties**: `http://localhost:3000/bounties`
3. **My Bounties** (Creator): `http://localhost:3000/my-bounties`
4. **Bounty Detail**: `http://localhost:3000/bounties/[id]`
5. **Reputation**: `http://localhost:3000/reputation`
6. **Payments Overview**: `http://localhost:3000/payments/overview`
7. **x402 Details**: `http://localhost:3000/payments/x402`

---

## ✅ Pre-Demo Checklist

- [ ] Database seeded with sample bounties
- [ ] Test wallet connected with funds
- [ ] Bounty created with x402 protocol
- [ ] Test application submitted
- [ ] AI evaluation endpoint tested
- [ ] Payment processing verified
- [ ] All pages load without errors
- [ ] Demo script rehearsed

---

## 🐛 Troubleshooting

**Issue**: Payment doesn't trigger

- Check: Evaluation score ≥ threshold
- Check: x402 protocol selected
- Check: Wallet has sufficient funds

**Issue**: AI evaluation fails

- Check: Gemini API key configured
- Check: AgentPay service active
- Check: Application has required data

---

## 📱 Mobile Demo Notes

The platform is fully responsive:

- Works on mobile browsers
- Phantom mobile wallet supported
- Touch-friendly UI
- Optimized dialogs and forms
