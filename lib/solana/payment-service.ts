import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// USDC Devnet mint address
const USDC_MINT_DEVNET = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

export class SolanaPaymentService {
  private connection: Connection;

  constructor() {
    const rpcUrl =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");
  }

  /**
   * Create a payment transaction (unsigned)
   */
  async createPaymentTransaction(
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amount: number,
    tokenMint?: PublicKey
  ): Promise<Transaction> {
    const transaction = new Transaction();

    if (tokenMint) {
      // SPL Token transfer (e.g., USDC)
      const fromTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        fromPubkey
      );
      const toTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        toPubkey
      );

      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromPubkey,
          amount * 1e6, // USDC has 6 decimals
          [],
          TOKEN_PROGRAM_ID
        )
      );
    } else {
      // Native SOL transfer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    }

    // Get recent blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  }

  /**
   * Create escrow account for bounty
   */
  async createEscrowAccount(
    creatorPubkey: PublicKey,
    amount: number
  ): Promise<{ escrowKeypair: Keypair; transaction: Transaction }> {
    const escrowKeypair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: creatorPubkey,
        newAccountPubkey: escrowKeypair.publicKey,
        lamports: amount * LAMPORTS_PER_SOL,
        space: 0,
        programId: SystemProgram.programId,
      })
    );

    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPubkey;

    return {
      escrowKeypair,
      transaction,
    };
  }

  /**
   * Release escrow to winner
   */
  async releaseEscrow(
    escrowPubkey: PublicKey,
    winnerPubkey: PublicKey,
    amount: number
  ): Promise<Transaction> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: escrowPubkey,
        toPubkey: winnerPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = escrowPubkey;

    return transaction;
  }

  /**
   * Verify transaction on-chain
   */
  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      const result = await this.connection.getSignatureStatus(signature);
      return (
        result.value?.confirmationStatus === "confirmed" ||
        result.value?.confirmationStatus === "finalized"
      );
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return false;
    }
  }

  /**
   * Get balance
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  }

  /**
   * Get USDC balance
   */
  async getUSDCBalance(pubkey: PublicKey): Promise<number> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        USDC_MINT_DEVNET,
        pubkey
      );
      const balance = await this.connection.getTokenAccountBalance(
        tokenAccount
      );
      return parseFloat(balance.value.uiAmountString || "0");
    } catch (error) {
      return 0;
    }
  }
}

export const solanaPaymentService = new SolanaPaymentService();
