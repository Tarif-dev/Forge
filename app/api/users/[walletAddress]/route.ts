import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[walletAddress] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeBounties = searchParams.get("include") === "bounties";

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        createdBounties: includeBounties
          ? {
              include: {
                applications: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        walletAddress: true,
                        reputationScore: true,
                      },
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                },
                _count: {
                  select: {
                    applications: true,
                  },
                },
              },
            }
          : {
              select: {
                id: true,
                title: true,
                reward: true,
                rewardToken: true,
                status: true,
                difficulty: true,
                paymentProtocol: true,
                autoPayThreshold: true,
                createdAt: true,
              },
            },
        applications: {
          include: {
            bounty: {
              select: {
                id: true,
                title: true,
                reward: true,
                rewardToken: true,
                status: true,
              },
            },
          },
        },
        achievements: true,
        reputation: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!user) {
      // Create new user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          walletAddress,
        },
      });
      return NextResponse.json(newUser);
    }

    // Rename createdBounties to bountiesCreated for consistency
    const response = {
      ...user,
      bountiesCreated: user.createdBounties,
    };
    delete (response as any).createdBounties;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[walletAddress] - Update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const body = await request.json();
    const { username, email, githubUsername, avatarUrl, bio } = body;

    const user = await prisma.user.update({
      where: { walletAddress },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(githubUsername && { githubUsername }),
        ...(avatarUrl && { avatarUrl }),
        ...(bio && { bio }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
