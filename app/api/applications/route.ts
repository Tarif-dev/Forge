import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/applications - Apply to a bounty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bountyId, walletAddress, message, githubPrUrl } = body;

    if (!bountyId || !walletAddress || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        bountyId,
        userId: user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this bounty" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        bountyId,
        userId: user.id,
        message,
        githubPrUrl,
      },
      include: {
        user: {
          select: {
            username: true,
            walletAddress: true,
            avatarUrl: true,
            reputationScore: true,
          },
        },
        bounty: {
          select: {
            title: true,
            reward: true,
          },
        },
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "COMMUNICATION",
        action: "APPLICATION_CREATED",
        description: `New application for bounty`,
        metadata: {
          applicationId: application.id,
          bountyId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

// GET /api/applications - Get applications (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bountyId = searchParams.get("bountyId");
    const walletAddress = searchParams.get("walletAddress");

    const where: any = {};

    if (bountyId) {
      where.bountyId = bountyId;
    }

    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });
      if (user) {
        where.userId = user.id;
      }
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            walletAddress: true,
            avatarUrl: true,
            reputationScore: true,
          },
        },
        bounty: {
          select: {
            title: true,
            reward: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
