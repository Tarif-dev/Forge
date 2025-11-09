import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reputation/leaderboard - Get top users by reputation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");

    const topUsers = await prisma.user.findMany({
      orderBy: {
        reputationScore: "desc",
      },
      take: limit,
      select: {
        id: true,
        username: true,
        walletAddress: true,
        avatarUrl: true,
        reputationScore: true,
        totalEarned: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            createdBounties: true,
            achievements: true,
          },
        },
      },
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
