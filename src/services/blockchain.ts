import { ethers } from "ethers";
import { contract_address } from "../../smart_contract/contract_address";
import contractABI from "../../smart_contract/abi.json";
import { Verifier } from "../types";
import { createUserCommitment } from "../utils/hashUtils";

// Smart contract interaction service
export class BlockchainService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  // Initialize the blockchain connection
  async initialize(): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        this.signer = await provider.getSigner();

        // Get network information
        const network = await provider.getNetwork();
        console.log("Connected to network:", {
          name: network.name,
          chainId: network.chainId.toString(),
          contractAddress: contract_address,
        });

        this.contract = new ethers.Contract(
          contract_address,
          contractABI,
          this.signer
        );
        return true;
      }
      throw new Error("MetaMask not found");
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error);
      return false;
    }
  }

  // Check if the service is ready
  isReady(): boolean {
    return this.contract !== null && this.signer !== null;
  }

  // Logout/disconnect from MetaMask
  async logout(): Promise<void> {
    try {
      // Clear the contract and signer
      this.contract = null;
      this.signer = null;

      // If MetaMask is available, we could also disconnect the account
      // Note: MetaMask doesn't have a direct disconnect method, but clearing our state is sufficient
      console.log("Logged out from blockchain service");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear our state
      this.contract = null;
      this.signer = null;
    }
  }

  // Get all verifiers from the smart contract
  async getAllVerifiers(): Promise<Verifier[]> {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized");
    }

    try {
      const result = await this.contract.getAllVerifiers();
      const [addresses, nicknames, authorized, addedAt] = result;

      const verifiers: Verifier[] = [];
      for (let i = 0; i < addresses.length; i++) {
        verifiers.push({
          address: addresses[i],
          nickname: nicknames[i],
          authorized: authorized[i],
          addedAt: Number(addedAt[i]),
        });
      }

      return verifiers;
    } catch (error) {
      console.error("Error fetching verifiers:", error);
      throw error;
    }
  }

  // Add a new verifier to the smart contract
  async addVerifier(address: string, nickname: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized");
    }

    try {
      // Validate address format
      if (!ethers.isAddress(address)) {
        throw new Error("Invalid Ethereum address format");
      }

      const tx = await this.contract.addVerifier(address, nickname);
      await tx.wait(); // Wait for transaction confirmation
      return tx.hash;
    } catch (error: unknown) {
      console.error("Error adding verifier:", error);

      // Handle specific contract errors
      if (error && typeof error === "object" && "reason" in error) {
        const errorWithReason = error as { reason: string };
        switch (errorWithReason.reason) {
          case "VerifierAlreadyExists":
            throw new Error("This verifier address is already registered");
          case "ZeroAddress":
            throw new Error("Invalid address: cannot be zero address");
          case "NotOwner":
            throw new Error("Only the contract owner can add verifiers");
          default:
            throw new Error(errorWithReason.reason);
        }
      }

      throw error;
    }
  }

  // Revoke a verifier from the smart contract
  async revokeVerifier(address: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized");
    }

    try {
      const tx = await this.contract.revokeVerifier(address);
      await tx.wait(); // Wait for transaction confirmation
      return tx.hash;
    } catch (error: unknown) {
      console.error("Error revoking verifier:", error);

      // Handle specific contract errors
      if (error && typeof error === "object" && "reason" in error) {
        const errorWithReason = error as { reason: string };
        switch (errorWithReason.reason) {
          case "VerifierNotFound":
            throw new Error("Verifier not found or already revoked");
          case "NotOwner":
            throw new Error("Only the contract owner can revoke verifiers");
          default:
            throw new Error(errorWithReason.reason);
        }
      }

      throw error;
    }
  }

  // Get the current user's wallet address
  async getCurrentAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Blockchain service not initialized");
    }

    return await this.signer.getAddress();
  }

  // Check if the current user is the contract owner
  async isOwner(): Promise<boolean> {
    if (!this.contract || !this.signer) {
      return false;
    }

    try {
      const currentAddress = await this.signer.getAddress();
      const ownerAddress = await this.contract.owner();

      console.log("Current address:", currentAddress);
      console.log("Contract owner:", ownerAddress);
      console.log("Contract address:", contract_address);

      return currentAddress.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking owner status:", error);
      console.error(
        "This might mean the contract doesn't exist on this network"
      );
      return false;
    }
  }

  // Get verifier count
  async getVerifierCount(): Promise<number> {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized");
    }

    try {
      const count = await this.contract.getVerifierCount();
      return Number(count);
    } catch (error) {
      console.error("Error getting verifier count:", error);
      throw error;
    }
  }

  // Issue ZKP Visa credential
  async issueZKPVisa(
    passportNumber: string,
    nickname: string,
    duration: number,
    documentVerified: boolean = true,
    paymentConfirmed: boolean = true
  ): Promise<{ txHash: string; commitment: string; salt: string }> {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized");
    }

    try {
      // Generate commitment hash from user data
      const { commitment, salt } = createUserCommitment({
        passportNumber,
        nickname,
        duration,
      });

      console.log("Generated commitment:", commitment);
      console.log("Generated salt:", salt);

      const tx = await this.contract.issueZKPVisa(
        commitment, // Use commitment instead of raw passport number
        documentVerified,
        paymentConfirmed
      );
      await tx.wait(); // Wait for transaction confirmation

      return {
        txHash: tx.hash,
        commitment,
        salt,
      };
    } catch (error: unknown) {
      console.error("Error issuing ZKP Visa:", error);

      // Handle specific contract errors
      if (error && typeof error === "object" && "reason" in error) {
        const errorWithReason = error as { reason: string };
        switch (errorWithReason.reason) {
          case "DocumentNotVerified":
            throw new Error(
              "Documents must be verified before issuing credential"
            );
          case "PaymentNotConfirmed":
            throw new Error(
              "Payment must be confirmed before issuing credential"
            );
          case "CredentialNotFound":
            throw new Error("This credential has already been issued");
          case "NotOwner":
            throw new Error("Only the contract owner can issue credentials");
          default:
            throw new Error(errorWithReason.reason);
        }
      }

      throw error;
    }
  }

  // Generate a random token hash for the credential
  generateTokenHash(): string {
    // Generate a random 32-byte hash
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return ethers.keccak256(randomBytes);
  }
}

// Singleton instance
export const blockchainService = new BlockchainService();
