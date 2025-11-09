import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/agents/activities - Get agent activities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentType = searchParams.get("agentType");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (agentType) {
      where.agentType = agentType;
    }

    const activities = await prisma.agentActivity.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Get stats
    const stats = await prisma.agentActivity.groupBy({
      by: ["agentType"],
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      activities,
      stats: stats.map((s) => ({
        agentType: s.agentType,
        count: s._count.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching agent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent activities" },
      { status: 500 }
    );
  }
}
