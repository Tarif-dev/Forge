import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { walletAddress: "7xK9M2nP4sQ6tR8vW3aB5cD1eF2gH4iJ6kL8mN0oP9qR" },
    update: {},
    create: {
      walletAddress: "7xK9M2nP4sQ6tR8vW3aB5cD1eF2gH4iJ6kL8mN0oP9qR",
      username: "alice_dev",
      reputationScore: 850,
      totalEarned: 5000,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { walletAddress: "5yJ8L1mN3pO5qR7sT9uV2wX4aB6cD8eF0gH2iJ4kL6mN" },
    update: {},
    create: {
      walletAddress: "5yJ8L1mN3pO5qR7sT9uV2wX4aB6cD8eF0gH2iJ4kL6mN",
      username: "bob_builder",
      reputationScore: 720,
      totalEarned: 3500,
    },
  });

  console.log("✅ Created users");

  // Create demo bounties
  const bounty1 = await prisma.bounty.create({
    data: {
      title: "Implement OAuth2 Authentication",
      description:
        "Add secure OAuth2 authentication flow with support for multiple providers including Google, GitHub, and Discord.",
      reward: 500,
      rewardToken: "USDC",
      status: "OPEN",
      difficulty: "INTERMEDIATE",
      category: "Backend",
      tags: ["TypeScript", "Security", "Authentication"],
      requirements:
        "Experience with OAuth2, JWT tokens, and secure session management required.",
      githubRepoUrl: "https://github.com/example/project",
      creatorId: user1.id,
    },
  });

  const bounty2 = await prisma.bounty.create({
    data: {
      title: "Design Mobile UI Components",
      description:
        "Create reusable mobile-first UI components using React Native with TypeScript.",
      reward: 750,
      rewardToken: "USDC",
      status: "OPEN",
      difficulty: "ADVANCED",
      category: "Frontend",
      tags: ["React Native", "UI/UX", "Mobile", "TypeScript"],
      requirements:
        "Strong React Native experience, portfolio of previous mobile UI work.",
      githubRepoUrl: "https://github.com/example/mobile-app",
      creatorId: user1.id,
    },
  });

  const bounty3 = await prisma.bounty.create({
    data: {
      title: "Optimize Database Queries",
      description:
        "Improve performance of critical database queries and add proper indexing to reduce load times.",
      reward: 400,
      rewardToken: "USDC",
      status: "IN_PROGRESS",
      difficulty: "EXPERT",
      category: "Backend",
      tags: ["PostgreSQL", "Performance", "Database"],
      requirements:
        "Expert knowledge of PostgreSQL optimization, query analysis, and indexing strategies.",
      creatorId: user2.id,
    },
  });

  console.log("✅ Created bounties");

  // Create demo applications
  await prisma.application.create({
    data: {
      bountyId: bounty1.id,
      userId: user2.id,
      message:
        "I have 5+ years experience with OAuth2 implementation. Check my GitHub for examples.",
      status: "PENDING",
    },
  });

  await prisma.application.create({
    data: {
      bountyId: bounty2.id,
      userId: user2.id,
      message:
        "Mobile UI specialist here! I can deliver high-quality components with smooth animations.",
      status: "ACCEPTED",
    },
  });

  console.log("✅ Created applications");

  // Create agent activities
  await prisma.agentActivity.createMany({
    data: [
      {
        agentType: "BOUNTY_CREATION",
        action: "BOUNTY_CREATED",
        description: "New bounty: Implement OAuth2 Authentication",
        metadata: { bountyId: bounty1.id },
      },
      {
        agentType: "CODE_EVALUATION",
        action: "EVALUATION_STARTED",
        description: "Starting code evaluation for mobile UI submission",
        metadata: { bountyId: bounty2.id },
      },
      {
        agentType: "PAYMENT_PROCESSOR",
        action: "PAYMENT_INITIATED",
        description: "Processing payment for completed bounty",
        metadata: { bountyId: bounty3.id, amount: 400 },
      },
    ],
  });

  console.log("✅ Created agent activities");

  // Create achievements
  await prisma.achievement.create({
    data: {
      userId: user2.id,
      type: "FIRST_COMPLETION",
      name: "First Victory",
      description: "Completed your first bounty",
    },
  });

  console.log("✅ Created achievements");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
