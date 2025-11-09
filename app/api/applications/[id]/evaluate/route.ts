import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { codeEvaluationAgent } from "@/lib/ai/code-evaluation-agent";

// POST /api/applications/[id]/evaluate - Evaluate a submission
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        bounty: true,
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

    // Run AI evaluation
    const evaluation = await codeEvaluationAgent.evaluateSubmission(
      application.bounty.title,
      application.bounty.requirements,
      application.githubPrUrl,
      application.message
    );

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

    // Update bounty status if approved
    if (evaluation.approved && evaluation.score >= 70) {
      await prisma.bounty.update({
        where: { id: application.bounty.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Log completion
      await prisma.agentActivity.create({
        data: {
          agentType: "BOUNTY_CREATION",
          action: "BOUNTY_COMPLETED",
          description: `Bounty "${application.bounty.title}" marked as completed`,
          metadata: {
            bountyId: application.bounty.id,
            winnerId: application.user.id,
          },
        },
      });
    }

    return NextResponse.json({
      application: updatedApplication,
      evaluation,
    });
  } catch (error) {
    console.error("Error evaluating application:", error);
    return NextResponse.json(
      { error: "Failed to evaluate application" },
      { status: 500 }
    );
  }
}
