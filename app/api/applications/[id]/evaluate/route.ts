import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { codeEvaluationAgent } from "@/lib/ai/code-evaluation-agent";
import { x402PaymentProcessor } from "@/lib/protocols/x402-payment-processor";
import { cashPaymentProcessor } from "@/lib/protocols/cash-payment-processor";
import { agentPayService } from "@/lib/services/agentpay-service";

// POST /api/applications/[id]/evaluate - Evaluate a submission with integrated payment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        bounty: {
          include: {
            creator: true,
          },
        },
        user: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (!application.githubPrUrl) {
      return NextResponse.json(
        { error: "No pull request URL provided" },
        { status: 400 }
      );
    }

    // Track AgentPay costs for this evaluation
    const agentId = `evaluation-agent-${application.id}`;
    const evaluationStartTime = Date.now();

    // Run AI evaluation (using Google Gemini)
    const evaluation = await codeEvaluationAgent.evaluateSubmission(
      application.bounty.title,
      application.bounty.requirements,
      application.githubPrUrl,
      application.message
    );

    // Calculate and log AgentPay cost for LLM usage
    const estimatedTokens = Math.ceil(
      (application.message.length + application.bounty.requirements.length) / 4
    );
    const llmCost = estimatedTokens * 0.000002; // Approximate Gemini Pro cost

    await agentPayService.payForLLMTokens({
      agentId,
      paymentType: "LLM",
      provider: "Google Gemini Pro",
      amount: llmCost,
      tokensUsed: estimatedTokens,
      metadata: {
        model: "gemini-pro",
        applicationId: application.id,
        bountyTitle: application.bounty.title,
      },
    });

    // Update application with evaluation results
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: {
        aiEvaluation: evaluation as any,
        evaluationScore: evaluation.score,
        evaluatedAt: new Date(),
        status:
          evaluation.approved && evaluation.score >= 70
            ? "APPROVED"
            : "SUBMITTED",
      },
      include: {
        bounty: true,
        user: true,
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "CODE_EVALUATION",
        action: "EVALUATION_COMPLETED",
        description: `AI evaluated submission for "${application.bounty.title}"`,
        metadata: {
          applicationId: application.id,
          score: evaluation.score,
          approved: evaluation.approved,
        },
        success: true,
      },
    });

    // ============================================
    // INTEGRATED AUTONOMOUS PAYMENT LOGIC
    // ============================================
    const threshold = application.bounty.autoPayThreshold || 70;
    let paymentResult = null;

    if (evaluation.approved && evaluation.score >= threshold) {
      // Update bounty status first
      await prisma.bounty.update({
        where: { id: application.bounty.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Determine payment protocol and execute autonomously
      const paymentProtocol = application.bounty.paymentProtocol || "SOL";

      try {
        switch (paymentProtocol) {
          case "X402":
            // x402 Autonomous Payment
            paymentResult = await x402PaymentProcessor.processAutonomousPayment(
              {
                fromAgent: `bounty-agent-${application.bounty.id}`,
                toAgent: application.user.walletAddress,
                amount: application.bounty.reward,
                bountyId: application.bounty.id,
                autonomous: true,
                metadata: {
                  evaluationScore: evaluation.score,
                  applicationId: application.id,
                  reason: "Autonomous payment triggered by AI evaluation",
                },
              }
            );

            // Log x402 payment
            await prisma.agentActivity.create({
              data: {
                agentType: "CODE_EVALUATION",
                action: "X402_PAYMENT_PROCESSED",
                description: `x402 autonomous payment of ${
                  application.bounty.reward
                } ${application.bounty.rewardToken} to ${
                  application.user.username || "developer"
                }`,
                metadata: {
                  protocol: "X402",
                  amount: application.bounty.reward,
                  score: evaluation.score,
                  transactionHash: paymentResult.transactionHash,
                },
                success: true,
              },
            });
            break;

          case "CASH":
            // Phantom CASH Payment
            paymentResult = await cashPaymentProcessor.processCASHPayment({
              fromWallet: application.bounty.creator.walletAddress,
              toWallet: application.user.walletAddress,
              amount: application.bounty.reward,
              bountyId: application.bounty.id,
              memo: `Bounty reward: ${application.bounty.title}`,
            });

            // Log CASH payment
            await prisma.agentActivity.create({
              data: {
                agentType: "CODE_EVALUATION",
                action: "CASH_PAYMENT_PROCESSED",
                description: `CASH payment of ${application.bounty.reward} ${
                  application.bounty.rewardToken
                } to ${application.user.username || "developer"}`,
                metadata: {
                  protocol: "CASH",
                  amount: application.bounty.reward,
                  fee: paymentResult.fee,
                  score: evaluation.score,
                  transactionHash: paymentResult.transactionHash,
                },
                success: true,
              },
            });
            break;

          default:
            // Traditional SOL/USDC payment (existing system)
            await prisma.payment.create({
              data: {
                amount: application.bounty.reward,
                token: application.bounty.rewardToken,
                status: "PROCESSING",
                protocol: paymentProtocol,
                bountyId: application.bounty.id,
                userId: application.user.id,
                metadata: {
                  evaluationScore: evaluation.score,
                  applicationId: application.id,
                },
              },
            });
        }

        // Update user reputation
        await prisma.reputation.create({
          data: {
            userId: application.user.id,
            score: Math.round(evaluation.score),
            reason: `Completed bounty: ${application.bounty.title}`,
            category: "BOUNTY_COMPLETION",
            metadata: {
              bountyId: application.bounty.id,
              evaluationScore: evaluation.score,
              paymentProtocol,
            },
          },
        });

        // Update user total earned
        await prisma.user.update({
          where: { id: application.user.id },
          data: {
            totalEarned: {
              increment: application.bounty.reward,
            },
            reputationScore: {
              increment: Math.round(evaluation.score),
            },
          },
        });
      } catch (paymentError) {
        console.error("Payment processing error:", paymentError);
        // Continue even if payment fails - log the error
        await prisma.agentActivity.create({
          data: {
            agentType: "CODE_EVALUATION",
            action: "PAYMENT_FAILED",
            description: `Failed to process ${paymentProtocol} payment`,
            metadata: {
              error: String(paymentError),
              bountyId: application.bounty.id,
            },
            success: false,
          },
        });
      }

      // Log completion
      await prisma.agentActivity.create({
        data: {
          agentType: "BOUNTY_CREATION",
          action: "BOUNTY_COMPLETED",
          description: `Bounty "${application.bounty.title}" completed with ${paymentProtocol} payment`,
          metadata: {
            bountyId: application.bounty.id,
            winnerId: application.user.id,
            paymentProtocol,
            score: evaluation.score,
          },
          success: true,
        },
      });
    }

    return NextResponse.json({
      application: updatedApplication,
      evaluation,
      paymentResult,
      autonomousPayment: evaluation.score >= threshold,
      paymentProtocol: application.bounty.paymentProtocol,
    });
  } catch (error) {
    console.error("Error evaluating application:", error);
    return NextResponse.json(
      { error: "Failed to evaluate application" },
      { status: 500 }
    );
  }
}
