import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bounties/[id] - Get a single bounty
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            avatarUrl: true,
            reputationScore: true,
            totalEarned: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                walletAddress: true,
                avatarUrl: true,
                reputationScore: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payments: {
          include: {
            user: {
              select: {
                username: true,
                walletAddress: true,
              },
            },
          },
        },
      },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Error fetching bounty:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounty" },
      { status: 500 }
    );
  }
}

// PATCH /api/bounties/[id] - Update a bounty
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, escrowAddress } = body;

    const bounty = await prisma.bounty.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(escrowAddress && { escrowAddress }),
        ...(status === "COMPLETED" && { completedAt: new Date() }),
      },
      include: {
        creator: true,
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "BOUNTY_CREATION",
        action: "BOUNTY_UPDATED",
        description: `Bounty updated: ${bounty.title}`,
        metadata: {
          bountyId: bounty.id,
          status: bounty.status,
        },
      },
    });

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Error updating bounty:", error);
    return NextResponse.json(
      { error: "Failed to update bounty" },
      { status: 500 }
    );
  }
}

// DELETE /api/bounties/[id] - Delete/Cancel a bounty
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bounty = await prisma.bounty.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    // Log agent activity
    await prisma.agentActivity.create({
      data: {
        agentType: "BOUNTY_CREATION",
        action: "BOUNTY_CANCELLED",
        description: `Bounty cancelled: ${bounty.title}`,
        metadata: {
          bountyId: bounty.id,
        },
      },
    });

    return NextResponse.json({ message: "Bounty cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling bounty:", error);
    return NextResponse.json(
      { error: "Failed to cancel bounty" },
      { status: 500 }
    );
  }
}
