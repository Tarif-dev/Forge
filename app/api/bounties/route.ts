import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bounties - Get all bounties with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const bounties = await prisma.bounty.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            avatarUrl: true,
            reputationScore: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bounties);
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounties" },
      { status: 500 }
    );
  }
}

// POST /api/bounties - Create a new bounty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      reward,
      rewardToken,
      difficulty,
      category,
      tags,
      requirements,
      githubRepoUrl,
      githubIssueUrl,
      deadline,
      creatorWalletAddress,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !reward ||
      !difficulty ||
      !category ||
      !creatorWalletAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: creatorWalletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: creatorWalletAddress,
        },
      });
    }

    // Create bounty
    const bounty = await prisma.bounty.create({
      data: {
        title,
        description,
        reward: parseFloat(reward),
        rewardToken: rewardToken || "USDC",
        difficulty,
        category,
        tags: tags || [],
        requirements,
        githubRepoUrl,
        githubIssueUrl,
        deadline: deadline ? new Date(deadline) : null,
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            avatarUrl: true,
            reputationScore: true,
          },
        },
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "BOUNTY_CREATION",
        action: "BOUNTY_CREATED",
        description: `New bounty created: ${title}`,
        metadata: {
          bountyId: bounty.id,
          reward: bounty.reward,
          category: bounty.category,
        },
      },
    });

    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    console.error("Error creating bounty:", error);
    return NextResponse.json(
      { error: "Failed to create bounty" },
      { status: 500 }
    );
  }
}
