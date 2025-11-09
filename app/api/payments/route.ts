import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublicKey } from "@solana/web3.js";
import { solanaPaymentService } from "@/lib/solana/payment-service";

// POST /api/payments/process - Process bounty payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bountyId, winnerId, transactionSignature } = body;

    if (!bountyId || !winnerId || !transactionSignature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get bounty and winner details
    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
      include: {
        creator: true,
      },
    });

    const winner = await prisma.user.findUnique({
      where: { id: winnerId },
    });

    if (!bounty || !winner) {
      return NextResponse.json(
        { error: "Bounty or winner not found" },
        { status: 404 }
      );
    }

    // Verify transaction on Solana
    const isValid = await solanaPaymentService.verifyTransaction(
      transactionSignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or unconfirmed transaction" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bountyId,
        userId: winnerId,
        amount: bounty.reward,
        token: bounty.rewardToken,
        status: "COMPLETED",
        transactionHash: transactionSignature,
        protocol: "SOLANA",
        completedAt: new Date(),
        metadata: {
          network: "devnet",
          escrowAddress: bounty.escrowAddress,
        },
      },
      include: {
        user: true,
        bounty: true,
      },
    });

    // Update user total earned
    await prisma.user.update({
      where: { id: winnerId },
      data: {
        totalEarned: {
          increment: bounty.reward,
        },
      },
    });

    // Update application status
    await prisma.application.updateMany({
      where: {
        bountyId,
        userId: winnerId,
      },
      data: {
        status: "PAID",
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

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "PAYMENT_PROCESSOR",
        action: "PAYMENT_COMPLETED",
        description: `Payment of ${bounty.reward} ${bounty.rewardToken} processed for "${bounty.title}"`,
        metadata: {
          paymentId: payment.id,
          amount: bounty.reward,
          token: bounty.rewardToken,
          transactionHash: transactionSignature,
        },
        success: true,
      },
    });

    // Update reputation
    await prisma.reputation.create({
      data: {
        userId: winnerId,
        category: "bounty_completion",
        score: 10,
        reason: `Completed bounty: ${bounty.title}`,
        metadata: {
          bountyId,
          reward: bounty.reward,
        },
      },
    });

    // Update reputation score
    await prisma.user.update({
      where: { id: winnerId },
      data: {
        reputationScore: {
          increment: 10,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

// GET /api/payments - Get payments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const bountyId = searchParams.get("bountyId");

    const where: any = {};
    if (userId) where.userId = userId;
    if (bountyId) where.bountyId = bountyId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            walletAddress: true,
            avatarUrl: true,
          },
        },
        bounty: {
          select: {
            title: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
