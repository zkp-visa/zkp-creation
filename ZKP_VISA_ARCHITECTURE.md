# ZKP Visa Application Architecture

## Overview

Your ZKP Visa application consists of two main components:

1. **`zkp-creation`** (this repository) - **Embassy/Issuer Application**
2. **`zkp-visa/smart-contract`** (GitHub repo) - **Smart Contract & Circuit Components**

## Architecture Flow

### 1. Embassy Role (zkp-creation)

This repository simulates a **country's embassy** that:

- Collects user information (passport number, nickname, duration)
- Verifies documents and processes payments
- Issues ZKP credentials on the blockchain
- Generates commitment hashes for privacy

### 2. Smart Contract Role (zkp-visa/smart-contract)

The smart contract repository contains:

- **Circom circuits** for ZK proof generation
- **Solidity contracts** for credential management
- **Verification logic** for ZK proofs

## Key Components

### Commitment Generation (NEW)

I've implemented the missing piece - **commitment generation logic**:

```typescript
// src/utils/hashUtils.ts
export function createUserCommitment(userData: {
  passportNumber: string;
  nickname: string;
  duration: number;
}): {
  commitment: string;
  salt: string;
};
```

**What this does:**

- Takes user data (passport, nickname, duration)
- Generates a deterministic commitment hash
- Creates a random salt for privacy
- Returns both commitment and salt

### Updated Blockchain Service

```typescript
// src/services/blockchain.ts
async issueZKPVisa(
  passportNumber: string,
  nickname: string,
  duration: number,
  documentVerified: boolean,
  paymentConfirmed: boolean
): Promise<{ txHash: string; commitment: string; salt: string }>
```

**What changed:**

- Now generates proper commitment hash from user data
- Passes commitment to smart contract (not raw passport number)
- Returns commitment and salt for ZK proof generation

### Smart Contract Integration

The smart contract expects:

```solidity
function issueZKPVisa(
  uint256 commitment,  // Hash commitment of user data
  bool documentVerified,
  bool paymentConfirmed
)
```

## Complete Flow

### 1. User Submission

```
User Data: {
  passportNumber: "A1234567",
  nickname: "John Doe",
  duration: 5 // minutes
}
```

### 2. Commitment Generation

```typescript
const { commitment, salt } = createUserCommitment(userData);
// commitment = "0x1234abcd..." (32-byte hash)
// salt = "0x5678efgh..." (random salt)
```

### 3. Smart Contract Call

```typescript
await contract.issueZKPVisa(commitment, true, true);
// Stores commitment in credentials mapping
// Adds to merkle tree for verification
```

### 4. ZK Proof Generation (Future)

```typescript
// User generates ZK proof proving:
// - They know the passport number
// - They have the secret salt
// - Their commitment is in the merkle tree
// - Without revealing the actual passport number
```

### 5. Verification (Future)

```typescript
// Verifier scans QR code
// Verifies ZK proof on smart contract
// Marks credential as used (one-time verification)
```

## Privacy Features

### Zero-Knowledge Properties

- **Passport number** is never stored on-chain
- **Only commitment hash** is stored
- **ZK proof** proves knowledge without revealing data
- **One-time use** prevents replay attacks

### Commitment Scheme

```
commitment = keccak256(passportNumber|nickname|durationSeconds|salt)
```

- **Deterministic**: Same data always generates same commitment
- **Privacy-preserving**: Cannot reverse-engineer original data
- **Unique**: Random salt ensures uniqueness

## Integration with Smart Contract Repository

### Circom Circuit (from smart-contract repo)

The circuit should verify:

1. User knows passport number
2. User has secret salt
3. Commitment = hash(passport + nickname + duration + salt)
4. Commitment is in merkle tree
5. Merkle root is valid

### Verifier Contract

The smart contract's `verifyZKPVisa` function:

1. Verifies ZK proof using Circom circuit
2. Checks commitment exists and not used
3. Validates merkle root
4. Marks credential as used
5. Logs verification

## Next Steps

### For Full ZKP Implementation

1. **Setup Circom Circuit** (in smart-contract repo)
2. **Generate Proving Keys** (.zkey files)
3. **Integrate snarkjs** for proof generation
4. **Update Verifier Contract** with real circuit

### For Testing

1. **Deploy Smart Contract** to testnet
2. **Test Commitment Generation** with various inputs
3. **Verify Smart Contract Integration**
4. **Test End-to-End Flow**

## Files Modified

### New Files

- `src/utils/hashUtils.ts` - Commitment generation utilities

### Modified Files

- `src/services/blockchain.ts` - Updated to use commitments
- `src/screens/PaymentScreen.tsx` - Updated to generate commitments

## Security Considerations

### Commitment Security

- Uses Keccak256 (same as Ethereum)
- Includes random salt for uniqueness
- Cannot be reversed to original data

### Smart Contract Security

- Only contract owner can issue credentials
- Credentials can only be used once
- Verifiers must be authorized
- Merkle trees provide efficient batch verification

## Testing the Implementation

### Test Commitment Generation

```typescript
import { createUserCommitment } from "./src/utils/hashUtils";

const userData = {
  passportNumber: "A1234567",
  nickname: "John Doe",
  duration: 5,
};

const { commitment, salt } = createUserCommitment(userData);
console.log("Commitment:", commitment);
console.log("Salt:", salt);
```

### Test Smart Contract Integration

```typescript
// Ensure you're connected to the right network
// Make sure you're the contract owner
// Test issuing a credential
```

This implementation provides the foundation for a complete ZKP Visa system with proper privacy-preserving commitments!
