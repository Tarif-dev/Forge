import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { agentPayService } from "@/lib/services/agentpay-service";

// POST /api/agentpay/pay - Process AgentPay payment (API/LLM/DATA)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, paymentType, provider, endpoint, amount, tokensUsed } =
      body;

    if (!agentId || !paymentType || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let paymentResult;

    // Process payment based on type
    switch (paymentType) {
      case "API":
        paymentResult = await agentPayService.payForAPI({
          agentId,
          paymentType: "API",
          provider,
          endpoint,
          amount: parseFloat(amount),
        });
        break;

      case "LLM":
        paymentResult = await agentPayService.payForLLMTokens({
          agentId,
          paymentType: "LLM",
          provider,
          amount: parseFloat(amount),
          tokensUsed: parseInt(tokensUsed),
        });
        break;

      case "DATA":
        paymentResult = await agentPayService.payForData({
          agentId,
          paymentType: "DATA",
          provider,
          amount: parseFloat(amount),
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid payment type" },
          { status: 400 }
        );
    }

    // Create AgentPayment record
    const payment = await prisma.agentPayment.create({
      data: {
        agentId,
        paymentType,
        provider,
        endpoint,
        amount: paymentResult.amount,
        transactionHash: paymentResult.transactionHash,
        status: paymentResult.status,
        tokensUsed,
        metadata: {
          responseData: paymentResult.responseData,
        },
        completedAt: new Date(),
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "PAYMENT_PROCESSOR",
        action: "AGENTPAY_PAYMENT_COMPLETED",
        description: `AgentPay ${paymentType} payment of $${paymentResult.amount} to ${provider}`,
        metadata: {
          paymentId: payment.id,
          agentId,
          paymentType,
          provider,
          tokensUsed,
        },
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      paymentResult,
      message: "AgentPay payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing AgentPay payment:", error);
    return NextResponse.json(
      {
        error: "Failed to process AgentPay payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/agentpay/pay - Get AgentPay transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get("agentId");
    const paymentType = searchParams.get("paymentType");

    const where: any = {};
    if (agentId) where.agentId = agentId;
    if (paymentType) where.paymentType = paymentType;

    const payments = await prisma.agentPayment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Get statistics
    const stats = {
      totalPayments: payments.length,
      totalCost: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
      byType: {
        API: payments.filter((p: any) => p.paymentType === "API").length,
        LLM: payments.filter((p: any) => p.paymentType === "LLM").length,
        DATA: payments.filter((p: any) => p.paymentType === "DATA").length,
      },
      topProviders: getTopProviders(payments),
    };

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Error fetching AgentPay payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch AgentPay payments" },
      { status: 500 }
    );
  }
}

// Helper function to get top providers
function getTopProviders(payments: any[]) {
  const providerCounts: Record<string, { count: number; cost: number }> = {};

  payments.forEach((payment) => {
    if (!providerCounts[payment.provider]) {
      providerCounts[payment.provider] = { count: 0, cost: 0 };
    }
    providerCounts[payment.provider].count++;
    providerCounts[payment.provider].cost += payment.amount;
  });

  return Object.entries(providerCounts)
    .map(([provider, data]) => ({ provider, ...data }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);
}
