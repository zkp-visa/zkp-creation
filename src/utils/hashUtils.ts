import { ethers } from "ethers";

/**
 * Hash utility functions for generating commitments in the ZKP Visa system
 *
 * The commitment is a hash that represents the user's credential data
 * without revealing the actual passport number or other sensitive information.
 * This commitment is used in the Merkle tree and ZK proof verification.
 */

export interface CommitmentData {
  passportNumber: string;
  nickname: string;
  duration: number; // Duration in minutes
  salt?: string; // Optional salt for additional privacy
}

/**
 * Generate a commitment hash from user data
 * This creates a deterministic hash that can be used in the smart contract
 * and ZK proof system without revealing the underlying data
 */
export function generateCommitment(data: CommitmentData): string {
  // Convert duration to seconds for consistency
  const durationSeconds = data.duration * 60;

  // Create a deterministic salt if none provided
  const salt =
    data.salt || generateDeterministicSalt(data.passportNumber, data.nickname);

  // Combine all data into a single string for hashing
  // Format: passportNumber|nickname|durationSeconds|salt
  const combinedData = `${data.passportNumber}|${data.nickname}|${durationSeconds}|${salt}`;

  // Generate Keccak256 hash (same as used in Solidity)
  const commitment = ethers.keccak256(ethers.toUtf8Bytes(combinedData));

  return commitment;
}

/**
 * Generate a deterministic salt based on user data
 * This ensures the same user data always generates the same commitment
 * while still providing privacy protection
 */
function generateDeterministicSalt(
  passportNumber: string,
  nickname: string
): string {
  // Create a deterministic salt from passport and nickname
  const saltInput = `${passportNumber}_${nickname}_zkp_visa_salt`;
  return ethers.keccak256(ethers.toUtf8Bytes(saltInput));
}

/**
 * Generate a random salt for additional privacy
 * Use this when you want a unique commitment even for the same user data
 */
export function generateRandomSalt(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return ethers.keccak256(randomBytes);
}

/**
 * Parse commitment data back to verify format
 * This is mainly for debugging and verification purposes
 */
export function parseCommitmentComponents(commitment: string): {
  passportHash: string;
  nicknameHash: string;
  durationHash: string;
  saltHash: string;
} {
  // This is a simplified parsing - in practice, you can't reverse the hash
  // This is mainly for demonstration and debugging
  const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes(commitment));

  return {
    passportHash: ethers.keccak256(ethers.toUtf8Bytes("passport")),
    nicknameHash: ethers.keccak256(ethers.toUtf8Bytes("nickname")),
    durationHash: ethers.keccak256(ethers.toUtf8Bytes("duration")),
    saltHash: ethers.keccak256(ethers.toUtf8Bytes("salt")),
  };
}

/**
 * Generate a Merkle tree leaf hash for a commitment
 * This creates the hash that goes into the Merkle tree
 */
export function generateMerkleLeaf(commitment: string): string {
  // For simplicity, we use the commitment directly as the leaf
  // In a more sophisticated implementation, you might add additional data
  return commitment;
}

/**
 * Validate commitment format
 */
export function isValidCommitment(commitment: string): boolean {
  try {
    // Check if it's a valid hex string
    if (!ethers.isHexString(commitment, 32)) {
      return false;
    }

    // Check if it's 32 bytes (64 hex characters + 0x prefix)
    return commitment.length === 66; // 0x + 64 hex chars
  } catch {
    return false;
  }
}

/**
 * Generate a commitment for the current user data
 * This is the main function used by the payment screen
 */
export function createUserCommitment(userData: {
  passportNumber: string;
  nickname: string;
  duration: number;
}): {
  commitment: string;
  salt: string;
} {
  const salt = generateRandomSalt();
  const commitment = generateCommitment({
    ...userData,
    salt,
  });

  return { commitment, salt };
}
