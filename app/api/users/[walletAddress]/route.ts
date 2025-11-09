import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[walletAddress] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress: params.walletAddress },
      include: {
        createdBounties: {
          select: {
            id: true,
            title: true,
            reward: true,
            status: true,
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
          walletAddress: params.walletAddress,
        },
      });
      return NextResponse.json(newUser);
    }

    return NextResponse.json(user);
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
  { params }: { params: { walletAddress: string } }
) {
  try {
    const body = await request.json();
    const { username, email, githubUsername, avatarUrl, bio } = body;

    const user = await prisma.user.update({
      where: { walletAddress: params.walletAddress },
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
