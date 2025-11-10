/**
 * x402 Payment Processor
 * Handles autonomous agent-to-agent payments using x402 protocol
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export interface X402PaymentRequest {
  fromAgent: string;
  toAgent: string;
  amount: number;
  bountyId?: string;
  autonomous?: boolean;
  metadata?: Record<string, any>;
}

export interface X402PaymentResult {
  transactionHash: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  timestamp: Date;
  gasUsed?: number;
}

export class X402PaymentProcessor {
  private connection: Connection;
  private readonly X402_PROGRAM_ID: string;

  constructor() {
    const rpcUrl =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");
    this.X402_PROGRAM_ID = process.env.X402_PROGRAM_ID || "X402ProgramId";
  }

  /**
   * Process autonomous payment using x402 protocol
   */
  async processAutonomousPayment(
    request: X402PaymentRequest
  ): Promise<X402PaymentResult> {
    try {
      console.log("🤖 Processing x402 autonomous payment:", request);

      // Validate request
      this.validatePaymentRequest(request);

      // Create payment transaction
      const transaction = await this.createX402Transaction(request);

      // For autonomous payments, we simulate the transaction
      // In production, this would interact with actual x402 protocol
      const signature = await this.simulateX402Transaction(
        transaction,
        request
      );

      return {
        transactionHash: signature,
        status: "SUCCESS",
        amount: request.amount,
        timestamp: new Date(),
        gasUsed: 5000, // Simulated gas
      };
    } catch (error) {
      console.error("❌ x402 payment failed:", error);
      throw new Error(
        `x402 payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Create x402 payment transaction
   */
  private async createX402Transaction(
    request: X402PaymentRequest
  ): Promise<Transaction> {
    const transaction = new Transaction();

    // Convert agent addresses to PublicKeys
    const fromPubkey = new PublicKey(request.fromAgent);
    const toPubkey = new PublicKey(request.toAgent);

    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: request.amount * LAMPORTS_PER_SOL,
      })
    );

    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  }

  /**
   * Simulate x402 transaction for demo purposes
   * In production, this would interact with real x402 protocol
   */
  private async simulateX402Transaction(
    transaction: Transaction,
    request: X402PaymentRequest
  ): Promise<string> {
    // Generate mock transaction signature
    const timestamp = Date.now();
    const mockSignature = `x402_${timestamp}_${request.fromAgent.slice(0, 8)}`;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ x402 transaction simulated:", mockSignature);
    return mockSignature;
  }

  /**
   * Verify x402 transaction status
   */
  async verifyTransaction(transactionHash: string): Promise<boolean> {
    try {
      // In production, verify against x402 protocol
      // For demo, check if it's a valid x402 signature
      return transactionHash.startsWith("x402_");
    } catch (error) {
      console.error("Error verifying x402 transaction:", error);
      return false;
    }
  }

  /**
   * Get x402 transaction details
   */
  async getTransactionDetails(transactionHash: string) {
    try {
      // In production, fetch from x402 protocol
      return {
        hash: transactionHash,
        status: "CONFIRMED",
        timestamp: new Date(),
        confirmations: 32,
      };
    } catch (error) {
      console.error("Error fetching x402 transaction:", error);
      return null;
    }
  }

  /**
   * Estimate x402 transaction cost
   */
  async estimateTransactionCost(amount: number): Promise<number> {
    // x402 protocol fees (typically very low for autonomous payments)
    const baseFee = 0.000005; // SOL
    const percentageFee = amount * 0.001; // 0.1%
    return baseFee + percentageFee;
  }

  /**
   * Check if payment is autonomous
   */
  isAutonomousPayment(metadata?: Record<string, any>): boolean {
    return (
      metadata?.autonomous === true || metadata?.trigger === "AI_EVALUATION"
    );
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: X402PaymentRequest): void {
    if (!request.fromAgent || !request.toAgent) {
      throw new Error("Both fromAgent and toAgent addresses are required");
    }

    if (!request.amount || request.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Validate Solana addresses
    try {
      new PublicKey(request.fromAgent);
      new PublicKey(request.toAgent);
    } catch (error) {
      throw new Error("Invalid Solana address format");
    }
  }

  /**
   * Get payment history for an agent
   */
  async getAgentPaymentHistory(
    agentAddress: string,
    limit: number = 50
  ): Promise<any[]> {
    // In production, fetch from x402 protocol
    // For demo, return mock data
    return [];
  }

  /**
   * Cancel pending payment (if supported by x402)
   */
  async cancelPayment(transactionHash: string): Promise<boolean> {
    try {
      console.log("Cancelling x402 payment:", transactionHash);
      // In production, interact with x402 protocol to cancel
      return true;
    } catch (error) {
      console.error("Error cancelling payment:", error);
      return false;
    }
  }

  /**
   * Batch process multiple payments (for efficiency)
   */
  async batchProcessPayments(
    requests: X402PaymentRequest[]
  ): Promise<X402PaymentResult[]> {
    const results: X402PaymentResult[] = [];

    for (const request of requests) {
      try {
        const result = await this.processAutonomousPayment(request);
        results.push(result);
      } catch (error) {
        results.push({
          transactionHash: "",
          status: "FAILED",
          amount: request.amount,
          timestamp: new Date(),
        });
      }
    }

    return results;
  }
}

// Singleton instance
export const x402PaymentProcessor = new X402PaymentProcessor();
