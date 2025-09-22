// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Verifier.sol";

/// @title ZKPVisaPermanent - Zero-Knowledge Proof Visa System
/// @notice A smart contract for managing ZKP-based visa credentials with privacy-preserving verification
/// @dev Uses Circom circuits for ZK proof generation and verification
contract ZKPVisaPermanent {
    // -------- Errors --------
    error NotOwner();
    error NotVerifier();
    error ZeroAddress();
    error VerifierAlreadyExists();
    error VerifierNotFound();
    error CredentialNotFound();
    error CredentialAlreadyUsed();
    error InvalidProof();
    error MerkleRootNotFound();
    error DocumentNotVerified();
    error PaymentNotConfirmed();

    // -------- Access Control --------
    address public owner;
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyVerifier() {
        if (!verifiers[msg.sender].authorized) revert NotVerifier();
        _;
    }

    // -------- Data Structures --------

    /// @notice Verifier information structure
    struct VerifierInfo {
        string nickname;
        bool authorized;
        uint256 addedAt;
    }

    /// @notice ZKP-Visa credential structure (privacy-preserving)
    struct ZKPVisaCredential {
        uint256 commitment; // Hash commitment of user data (passport, etc.)
        uint256 issuedAt; // Timestamp when issued
        bool used; // Whether this credential has been verified/used
        bool exists; // Whether this credential exists
        uint256 merkleRootIndex; // Which merkle root this credential belongs to
    }

    /// @notice Verification log entry
    struct VerificationLog {
        uint256 commitment; // Commitment of the verified credential
        address verifier; // Address of the verifier who verified
        string verifierName; // Name of the verifier
        uint256 verifiedAt; // Timestamp of verification
    }

    /// @notice Merkle root entry for batch credential issuance
    struct MerkleRoot {
        uint256 root; // Merkle root hash
        uint256 timestamp; // When this root was added
        uint256 credentialCount; // Number of credentials in this batch
    }

    // -------- Storage --------

    /// @notice Mapping from verifier address to their information
    mapping(address => VerifierInfo) public verifiers;

    /// @notice Array to keep track of all verifier addresses for enumeration
    address[] public verifierList;

    /// @notice Mapping from commitment to credential (commitment = hash of user data)
    mapping(uint256 => ZKPVisaCredential) public credentials;

    /// @notice Array to track all issued credentials for admin viewing
    uint256[] public issuedCredentials;

    /// @notice Array of all verification logs
    VerificationLog[] public verificationLogs;

    /// @notice Array of merkle roots for batch credential management
    MerkleRoot[] public merkleRoots;

    /// @notice Current merkle root index
    uint256 public currentMerkleRootIndex;

    // -------- Events --------
    event VerifierAdded(address indexed verifier, string nickname);
    event VerifierRevoked(address indexed verifier, string nickname);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event ZKPVisaIssued(
        uint256 indexed commitment,
        uint256 merkleRootIndex,
        uint256 issuedAt
    );
    event ZKPVisaVerified(
        uint256 indexed commitment,
        address indexed verifier,
        string verifierName,
        uint256 verifiedAt
    );
    event MerkleRootAdded(
        uint256 indexed root,
        uint256 indexed index,
        uint256 timestamp
    );

    // -------- Constructor --------
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ========================================================================
    // ADMIN FUNCTIONS (Contract Deployer Only)
    // ========================================================================

    /// @notice Add a new verifier with nickname and wallet address
    /// @param verifier The wallet address of the verifier to register
    /// @param nickname Human-readable name for the verifier
    function addVerifier(
        address verifier,
        string calldata nickname
    ) external onlyOwner {
        if (verifier == address(0)) revert ZeroAddress();
        if (verifiers[verifier].authorized) revert VerifierAlreadyExists();

        verifiers[verifier] = VerifierInfo({
            nickname: nickname,
            authorized: true,
            addedAt: block.timestamp
        });

        verifierList.push(verifier);
        emit VerifierAdded(verifier, nickname);
    }

    /// @notice Revoke a verifier's authorization
    /// @param verifier The wallet address of the verifier to revoke
    function revokeVerifier(address verifier) external onlyOwner {
        if (!verifiers[verifier].authorized) revert VerifierNotFound();

        string memory nickname = verifiers[verifier].nickname;
        verifiers[verifier].authorized = false;

        // Remove from verifierList array
        for (uint i = 0; i < verifierList.length; i++) {
            if (verifierList[i] == verifier) {
                verifierList[i] = verifierList[verifierList.length - 1];
                verifierList.pop();
                break;
            }
        }

        emit VerifierRevoked(verifier, nickname);
    }

    /// @notice Add a new merkle root for batch credential management
    /// @param root The merkle root hash
    /// @param credentialCount Number of credentials in this batch
    function addMerkleRoot(
        uint256 root,
        uint256 credentialCount
    ) external onlyOwner {
        merkleRoots.push(
            MerkleRoot({
                root: root,
                timestamp: block.timestamp,
                credentialCount: credentialCount
            })
        );

        currentMerkleRootIndex = merkleRoots.length - 1;
        emit MerkleRootAdded(root, currentMerkleRootIndex, block.timestamp);
    }

    /// @notice Issue a ZKP-Visa credential to a user
    /// @param commitment Hash commitment of user data (passport, etc.)
    /// @param documentVerified Must be true to issue (document verification)
    /// @param paymentConfirmed Must be true to issue (payment confirmation)
    function issueZKPVisa(
        uint256 commitment,
        bool documentVerified,
        bool paymentConfirmed
    ) external onlyOwner {
        if (!documentVerified) revert DocumentNotVerified();
        if (!paymentConfirmed) revert PaymentNotConfirmed();
        if (credentials[commitment].exists) revert CredentialNotFound();

        credentials[commitment] = ZKPVisaCredential({
            commitment: commitment,
            issuedAt: block.timestamp,
            used: false,
            exists: true,
            merkleRootIndex: currentMerkleRootIndex
        });

        issuedCredentials.push(commitment);
        emit ZKPVisaIssued(commitment, currentMerkleRootIndex, block.timestamp);
    }

    /// @notice Get all verifiers (for admin interface)
    function getAllVerifiers()
        external
        view
        onlyOwner
        returns (
            address[] memory addresses,
            string[] memory nicknames,
            bool[] memory authorized,
            uint256[] memory addedAt
        )
    {
        uint256 length = verifierList.length;
        addresses = new address[](length);
        nicknames = new string[](length);
        authorized = new bool[](length);
        addedAt = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            address verifierAddr = verifierList[i];
            VerifierInfo storage info = verifiers[verifierAddr];

            addresses[i] = verifierAddr;
            nicknames[i] = info.nickname;
            authorized[i] = info.authorized;
            addedAt[i] = info.addedAt;
        }
    }

    /// @notice Get all verification logs (for admin dashboard)
    function getAllVerificationLogs()
        external
        view
        onlyOwner
        returns (VerificationLog[] memory logs)
    {
        return verificationLogs;
    }

    /// @notice Get all issued credentials (for admin dashboard)
    function getAllIssuedCredentials()
        external
        view
        onlyOwner
        returns (uint256[] memory commitments)
    {
        return issuedCredentials;
    }

    /// @notice Get all merkle roots (for admin dashboard)
    function getAllMerkleRoots()
        external
        view
        onlyOwner
        returns (MerkleRoot[] memory roots)
    {
        return merkleRoots;
    }

    /// @notice Transfer ownership (admin role)
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ========================================================================
    // VERIFIER FUNCTIONS (Authorized Verifiers Only)
    // ========================================================================

    /// @notice Check if the calling address is an authorized verifier
    function checkMyStatus()
        external
        view
        returns (bool authorized, string memory nickname, uint256 addedAt)
    {
        VerifierInfo storage info = verifiers[msg.sender];
        return (info.authorized, info.nickname, info.addedAt);
    }

    /// @notice Verify a ZKP-Visa credential using zero-knowledge proof
    /// @param a First part of the ZK proof
    /// @param b Second part of the ZK proof
    /// @param c Third part of the ZK proof
    /// @param publicSignals The public signals from the proof
    /// @return success True if verification successful
    function verifyZKPVisa(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory publicSignals
    ) external onlyVerifier returns (bool success) {
        // Verify the ZK proof using the imported Verifier contract
        Verifier verifier = new Verifier();
        if (!verifier.verifyProof(a, b, c, publicSignals)) {
            revert InvalidProof();
        }

        // Extract commitment from public signals
        uint256 commitment = publicSignals[0];
        uint256 merkleRoot = publicSignals[1];

        // Check if credential exists and is not used
        ZKPVisaCredential storage credential = credentials[commitment];
        if (!credential.exists) revert CredentialNotFound();
        if (credential.used) revert CredentialAlreadyUsed();

        // Verify merkle root matches
        if (merkleRoots[credential.merkleRootIndex].root != merkleRoot) {
            revert MerkleRootNotFound();
        }

        // Mark as used (one-time verification)
        credential.used = true;

        // Add to verification log
        VerificationLog memory log = VerificationLog({
            commitment: commitment,
            verifier: msg.sender,
            verifierName: verifiers[msg.sender].nickname,
            verifiedAt: block.timestamp
        });
        verificationLogs.push(log);

        emit ZKPVisaVerified(
            commitment,
            msg.sender,
            verifiers[msg.sender].nickname,
            block.timestamp
        );

        return true;
    }

    // ========================================================================
    // PUBLIC VIEW FUNCTIONS (Anyone Can Call)
    // ========================================================================

    /// @notice Get total number of authorized verifiers
    function getVerifierCount() external view returns (uint256 count) {
        return verifierList.length;
    }

    /// @notice Get current merkle root
    function getCurrentMerkleRoot() external view returns (uint256 root) {
        if (merkleRoots.length == 0) return 0;
        return merkleRoots[currentMerkleRootIndex].root;
    }
}
