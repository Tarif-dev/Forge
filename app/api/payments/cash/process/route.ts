import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cashPaymentProcessor } from "@/lib/protocols/cash-payment-processor";

// POST /api/payments/cash/process - Process CASH payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bountyId, contributorAddress, amount, memo } = body;

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

    // Process CASH payment
    const paymentResult = await cashPaymentProcessor.processCASHPayment({
      fromWallet: bounty.creator.walletAddress,
      toWallet: contributorAddress,
      amount: parseFloat(amount),
      bountyId,
      memo: memo || `Payment for bounty: ${bounty.title}`,
    });

    // Create CASH transaction record
    const transaction = await prisma.cASHTransaction.create({
      data: {
        fromWallet: bounty.creator.walletAddress,
        toWallet: contributorAddress,
        bountyId,
        amount: parseFloat(amount),
        transactionHash: paymentResult.transactionHash,
        fee: paymentResult.fee,
        status: paymentResult.status,
        metadata: {
          memo,
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
        action: "CASH_PAYMENT_COMPLETED",
        description: `Phantom CASH payment of ${amount} processed for bounty "${bounty.title}"`,
        metadata: {
          transactionId: transaction.id,
          transactionHash: paymentResult.transactionHash,
          amount,
          fee: paymentResult.fee,
        },
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      paymentResult,
      message: "CASH payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing CASH payment:", error);
    return NextResponse.json(
      {
        error: "Failed to process CASH payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/payments/cash/process - Get CASH transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bountyId = searchParams.get("bountyId");
    const walletAddress = searchParams.get("walletAddress");

    const where: any = {};
    if (bountyId) where.bountyId = bountyId;
    if (walletAddress) {
      where.OR = [{ fromWallet: walletAddress }, { toWallet: walletAddress }];
    }

    const transactions = await prisma.cASHTransaction.findMany({
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
    console.error("Error fetching CASH transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch CASH transactions" },
      { status: 500 }
    );
  }
}
