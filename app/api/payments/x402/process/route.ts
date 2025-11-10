import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { x402PaymentProcessor } from "@/lib/protocols/x402-payment-processor";

// POST /api/payments/x402/process - Process autonomous x402 payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bountyId,
      contributorAddress,
      amount,
      evaluationScore,
      autonomous,
    } = body;

    if (!bountyId || !contributorAddress || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get bounty and contributor details
    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
      include: { creator: true },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    // Find or create contributor
    let contributor = await prisma.user.findUnique({
      where: { walletAddress: contributorAddress },
    });

    if (!contributor) {
      contributor = await prisma.user.create({
        data: { walletAddress: contributorAddress },
      });
    }

    // Process x402 payment
    const paymentResult = await x402PaymentProcessor.processAutonomousPayment({
      fromAgent: bounty.creator.walletAddress,
      toAgent: contributorAddress,
      amount: parseFloat(amount),
      bountyId,
      autonomous: autonomous !== false,
      metadata: {
        evaluationScore,
        trigger: "AI_EVALUATION",
      },
    });

    // Create x402 transaction record
    const transaction = await prisma.x402Transaction.create({
      data: {
        fromAgent: bounty.creator.walletAddress,
        toAgent: contributorAddress,
        bountyId,
        amount: parseFloat(amount),
        transactionHash: paymentResult.transactionHash,
        status: paymentResult.status,
        autonomous: autonomous !== false,
        metadata: {
          evaluationScore,
          gasUsed: paymentResult.gasUsed,
        },
        completedAt: new Date(),
      },
    });

    // Update bounty status
    await prisma.bounty.update({
      where: { id: bountyId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Update contributor earnings and reputation
    await prisma.user.update({
      where: { id: contributor.id },
      data: {
        totalEarned: { increment: parseFloat(amount) },
        reputationScore: { increment: 10 },
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "PAYMENT_PROCESSOR",
        action: "X402_PAYMENT_COMPLETED",
        description: `x402 autonomous payment of ${amount} processed for bounty "${bounty.title}"`,
        metadata: {
          transactionId: transaction.id,
          transactionHash: paymentResult.transactionHash,
          amount,
          autonomous: true,
        },
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      paymentResult,
      message: "x402 payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing x402 payment:", error);
    return NextResponse.json(
      {
        error: "Failed to process x402 payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/payments/x402/process - Get x402 transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bountyId = searchParams.get("bountyId");
    const agentAddress = searchParams.get("agentAddress");

    const where: any = {};
    if (bountyId) where.bountyId = bountyId;
    if (agentAddress) {
      where.OR = [{ fromAgent: agentAddress }, { toAgent: agentAddress }];
    }

    const transactions = await prisma.x402Transaction.findMany({
      where,
      include: {
        bounty: {
          select: {
            title: true,
            reward: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching x402 transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch x402 transactions" },
      { status: 500 }
    );
  }
}
