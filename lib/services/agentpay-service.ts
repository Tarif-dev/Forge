/**
 * AgentPay Service
 * Enables AI agents to autonomously pay for APIs, LLM tokens, and data via HTTP-402
 */

import axios, { AxiosRequestConfig } from "axios";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface AgentPayRequest {
  agentId: string;
  paymentType: "API" | "LLM" | "DATA";
  provider: string;
  endpoint?: string;
  amount: number;
  tokensUsed?: number;
  metadata?: Record<string, any>;
}

export interface AgentPayResult {
  transactionHash: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  tokensUsed?: number;
  timestamp: Date;
  responseData?: any;
}

export interface HTTP402Response {
  status: number;
  headers: Record<string, string>;
  data: any;
  paymentRequired: boolean;
  paymentDetails?: {
    amount: number;
    currency: string;
    paymentAddress: string;
  };
}

export class AgentPayService {
  private connection: Connection;
  private readonly AGENTPAY_ENDPOINT: string;

  constructor() {
    const rpcUrl =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");
    this.AGENTPAY_ENDPOINT =
      process.env.AGENTPAY_ENDPOINT || "https://agentpay.example.com";
  }

  /**
   * Process autonomous API payment
   */
  async payForAPI(request: AgentPayRequest): Promise<AgentPayResult> {
    try {
      console.log("🤖 AgentPay: Processing API payment:", request);

      // Validate request
      this.validatePaymentRequest(request);

      // Make HTTP-402 request
      const response = await this.makeHTTP402Request(
        request.endpoint!,
        request.amount
      );

      // Process micropayment
      const transactionHash = await this.processMicropayment(
        request.agentId,
        request.amount,
        response.paymentDetails
      );

      return {
        transactionHash,
        status: "SUCCESS",
        amount: request.amount,
        timestamp: new Date(),
        responseData: response.data,
      };
    } catch (error) {
      console.error("❌ AgentPay API payment failed:", error);
      throw new Error(
        `AgentPay failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Process LLM token payment
   */
  async payForLLMTokens(request: AgentPayRequest): Promise<AgentPayResult> {
    try {
      console.log("🤖 AgentPay: Processing LLM payment:", request);

      const costPerToken = this.getLLMCostPerToken(request.provider);
      const totalCost = costPerToken * (request.tokensUsed || 0);

      // Process micropayment for LLM tokens
      const transactionHash = await this.processMicropayment(
        request.agentId,
        totalCost
      );

      return {
        transactionHash,
        status: "SUCCESS",
        amount: totalCost,
        tokensUsed: request.tokensUsed,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("❌ AgentPay LLM payment failed:", error);
      throw new Error(
        `LLM payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Process data access payment
   */
  async payForData(request: AgentPayRequest): Promise<AgentPayResult> {
    try {
      console.log("🤖 AgentPay: Processing data payment:", request);

      const transactionHash = await this.processMicropayment(
        request.agentId,
        request.amount
      );

      return {
        transactionHash,
        status: "SUCCESS",
        amount: request.amount,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("❌ AgentPay data payment failed:", error);
      throw new Error(
        `Data payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Make HTTP-402 payment required request
   */
  private async makeHTTP402Request(
    endpoint: string,
    maxAmount: number
  ): Promise<HTTP402Response> {
    try {
      const response = await axios.get(endpoint, {
        validateStatus: (status) => status === 402 || status === 200,
      });

      if (response.status === 402) {
        // Parse HTTP-402 Payment Required response
        const paymentDetails = this.parseHTTP402Headers(response.headers);

        return {
          status: 402,
          headers: response.headers as Record<string, string>,
          data: null,
          paymentRequired: true,
          paymentDetails,
        };
      }

      return {
        status: 200,
        headers: response.headers as Record<string, string>,
        data: response.data,
        paymentRequired: false,
      };
    } catch (error) {
      console.error("HTTP-402 request error:", error);
      throw error;
    }
  }

  /**
   * Parse HTTP-402 payment headers
   */
  private parseHTTP402Headers(headers: any): {
    amount: number;
    currency: string;
    paymentAddress: string;
  } {
    // Parse standard HTTP-402 headers
    const amount = parseFloat(headers["x-payment-amount"] || "0");
    const currency = headers["x-payment-currency"] || "USDC";
    const paymentAddress =
      headers["x-payment-address"] || "DefaultPaymentAddress";

    return { amount, currency, paymentAddress };
  }

  /**
   * Process micropayment via USDC on Solana
   */
  private async processMicropayment(
    agentId: string,
    amount: number,
    paymentDetails?: any
  ): Promise<string> {
    // Generate mock transaction for demo
    const timestamp = Date.now();
    const mockSignature = `agentpay_${timestamp}_${agentId.slice(0, 8)}`;

    // Simulate micropayment processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("✅ AgentPay micropayment processed:", mockSignature);
    return mockSignature;
  }

  /**
   * Get LLM cost per token
   */
  private getLLMCostPerToken(provider: string): number {
    const costs: Record<string, number> = {
      "openai-gpt4": 0.00003, // $0.03 per 1K tokens
      "openai-gpt3.5": 0.000002, // $0.002 per 1K tokens
      "anthropic-claude": 0.000024, // $0.024 per 1K tokens
      "google-gemini": 0.0000001, // $0.0001 per 1K tokens (promotional)
      default: 0.00001,
    };

    return costs[provider] || costs.default;
  }

  /**
   * Estimate API call cost
   */
  async estimateAPICost(
    endpoint: string,
    estimatedTokens?: number
  ): Promise<number> {
    // Simulate cost estimation
    const baseCost = 0.001; // $0.001 base cost
    const tokenCost = (estimatedTokens || 100) * 0.00001;
    return baseCost + tokenCost;
  }

  /**
   * Get agent payment budget
   */
  async getAgentBudget(agentId: string): Promise<{
    total: number;
    used: number;
    remaining: number;
  }> {
    // In production, fetch from database
    return {
      total: 10.0, // $10 budget
      used: 2.5, // $2.5 used
      remaining: 7.5, // $7.5 remaining
    };
  }

  /**
   * Track API usage for agent
   */
  async trackUsage(agentId: string, cost: number, provider: string) {
    console.log(`📊 Tracking usage for ${agentId}: $${cost} (${provider})`);
    // In production, store in database
  }

  /**
   * Get usage statistics
   */
  async getUsageStatistics(agentId: string) {
    // In production, fetch from database
    return {
      totalCalls: 150,
      totalCost: 2.5,
      averageCost: 0.0167,
      topProviders: [
        { name: "OpenAI GPT-4", calls: 80, cost: 1.5 },
        { name: "Google Gemini", calls: 70, cost: 1.0 },
      ],
      costByDay: [
        { date: "2025-11-01", cost: 0.5 },
        { date: "2025-11-02", cost: 0.8 },
        { date: "2025-11-03", cost: 1.2 },
      ],
    };
  }

  /**
   * Optimize API costs
   */
  async optimizeAPICosts(agentId: string): Promise<{
    savings: number;
    recommendations: string[];
  }> {
    return {
      savings: 0.75, // $0.75 potential savings
      recommendations: [
        "Use Google Gemini for simple tasks (67% cheaper)",
        "Batch API calls to reduce overhead",
        "Cache frequent queries (estimated 30% reduction)",
      ],
    };
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: AgentPayRequest): void {
    if (!request.agentId) {
      throw new Error("Agent ID is required");
    }

    if (!request.amount || request.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (request.paymentType === "API" && !request.endpoint) {
      throw new Error("API endpoint is required for API payments");
    }

    if (request.paymentType === "LLM" && !request.tokensUsed) {
      throw new Error("Token count is required for LLM payments");
    }
  }

  /**
   * Get payment history for agent
   */
  async getPaymentHistory(agentId: string, limit: number = 50): Promise<any[]> {
    // In production, fetch from database
    return [];
  }

  /**
   * Set payment budget for agent
   */
  async setAgentBudget(agentId: string, budget: number): Promise<boolean> {
    try {
      console.log(`Setting budget for ${agentId}: $${budget}`);
      // In production, store in database
      return true;
    } catch (error) {
      console.error("Error setting budget:", error);
      return false;
    }
  }

  /**
   * Check if agent has sufficient budget
   */
  async hasSufficientBudget(agentId: string, amount: number): Promise<boolean> {
    const budget = await this.getAgentBudget(agentId);
    return budget.remaining >= amount;
  }
}

// Singleton instance
export const agentPayService = new AgentPayService();
