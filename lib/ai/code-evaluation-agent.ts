import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface EvaluationResult {
  approved: boolean;
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export class CodeEvaluationAgent {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5" });
  }

  async evaluateSubmission(
    bountyTitle: string,
    bountyRequirements: string,
    prUrl: string,
    prDescription: string,
    diffContent?: string
  ): Promise<EvaluationResult> {
    const prompt = `
You are an AI code reviewer for an open source bounty platform. Evaluate the following pull request submission.

**Bounty Title:** ${bountyTitle}

**Requirements:** ${bountyRequirements}

**Pull Request URL:** ${prUrl}

**Pull Request Description:** ${prDescription}

${diffContent ? `**Code Changes:**\n${diffContent.substring(0, 4000)}` : ""}

Please evaluate this submission and provide:
1. Whether to APPROVE or REJECT (based on if requirements are met)
2. A score from 0-100
3. Detailed feedback
4. Key strengths (list 2-3 points)
5. Weaknesses or areas for improvement (list 2-3 points)
6. Recommendations for the contributor

Respond in JSON format:
{
  "approved": boolean,
  "score": number,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["rec1", "rec2"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid AI response format");
      }

      const evaluation: EvaluationResult = JSON.parse(jsonMatch[0]);

      // Validate response
      if (
        typeof evaluation.approved !== "boolean" ||
        typeof evaluation.score !== "number"
      ) {
        throw new Error("Invalid evaluation format");
      }

      return evaluation;
    } catch (error) {
      console.error("AI Evaluation Error:", error);
      // Fallback evaluation
      return {
        approved: false,
        score: 50,
        feedback:
          "Unable to complete automatic evaluation. Manual review required.",
        strengths: ["Submission received"],
        weaknesses: ["Automatic evaluation failed"],
        recommendations: ["Please request manual review from bounty creator"],
      };
    }
  }

  async generateBountyDescription(
    title: string,
    category: string,
    techStack: string[]
  ): Promise<string> {
    const prompt = `
Generate a clear, professional bounty description for:

**Title:** ${title}
**Category:** ${category}
**Tech Stack:** ${techStack.join(", ")}

Create a description that includes:
1. What needs to be built/fixed
2. Key requirements
3. Technical specifications
4. Acceptance criteria

Keep it concise (150-200 words) and professional.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Description generation error:", error);
      return "Description generation failed. Please add manually.";
    }
  }

  async suggestBountyReward(
    difficulty: string,
    estimatedHours: number,
    category: string
  ): Promise<number> {
    const baseRates = {
      BEGINNER: 25,
      INTERMEDIATE: 50,
      ADVANCED: 75,
      EXPERT: 100,
    };

    const categoryMultipliers = {
      "Smart Contract": 1.5,
      Backend: 1.2,
      Frontend: 1.0,
      "UI/UX": 0.9,
      DevOps: 1.3,
    };

    const baseRate = baseRates[difficulty as keyof typeof baseRates] || 50;
    const multiplier =
      categoryMultipliers[category as keyof typeof categoryMultipliers] || 1.0;

    return Math.round(baseRate * estimatedHours * multiplier);
  }
}

// Singleton instance
export const codeEvaluationAgent = new CodeEvaluationAgent();
