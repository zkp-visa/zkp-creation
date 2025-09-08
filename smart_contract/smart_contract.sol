// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ZKPVisa - Admin & Verifier Management System
/// @notice A smart contract for managing verifiers with two main flows:
///         - Admin (Contract Deployer): Manages verifier registration and authorization
///         - Verifier (Airport Authority): Can check their authorization status
/// @dev Simplified version focusing on verifier management only

contract ZKPVisa {
    // -------- Errors (gas-efficient) --------
    error NotOwner();
    error NotVerifier();
    error ZeroAddress();
    error VerifierAlreadyExists();
    error VerifierNotFound();
    error CredentialNotFound();
    error CredentialAlreadyUsed();
    error TokenHashAlreadyExists();
    error DocumentNotVerified();
    error PaymentNotConfirmed();

    // -------- Access Control --------

    /// @notice Admin (Contract Deployer) - Manages the verifier system
    address public owner;
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /// @notice Verifier modifier - only authorized verifiers can call
    modifier onlyVerifier() {
        if (!verifiers[msg.sender].authorized) revert NotVerifier();
        _;
    }

    // -------- Data Structures --------

    /// @notice Verifier information structure
    struct VerifierInfo {
        string nickname; // Human-readable name for the verifier
        bool authorized; // Authorization status
        uint256 addedAt; // Timestamp when added
    }

    /// @notice ZKP-Visa credential structure
    struct ZKPVisaCredential {
        string passportNumber; // User's passport number
        uint256 issuedAt; // Timestamp when issued
        bool used; // Whether this credential has been verified/used
        bool exists; // Whether this credential exists
    }

    /// @notice Verification log entry
    struct VerificationLog {
        bytes32 credentialHash; // Hash of the verified credential
        address verifier; // Address of the verifier who verified
        string verifierName; // Name of the verifier
        uint256 verifiedAt; // Timestamp of verification
    }

    // -------- Storage --------

    /// @notice Mapping from verifier address to their information
    mapping(address => VerifierInfo) public verifiers;

    /// @notice Array to keep track of all verifier addresses for enumeration
    address[] public verifierList;

    /// @notice Mapping from token hash to credential (token is never stored on-chain)
    mapping(bytes32 => ZKPVisaCredential) public credentials;

    /// @notice Array to track all issued credentials for admin viewing
    bytes32[] public issuedCredentials;

    /// @notice Array of all verification logs
    VerificationLog[] public verificationLogs;

    // -------- Events --------
    event VerifierAdded(address indexed verifier, string nickname);
    event VerifierRevoked(address indexed verifier, string nickname);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event ZKPVisaIssued(
        bytes32 indexed tokenHash,
        string passportNumber,
        uint256 issuedAt
    );
    event ZKPVisaVerified(
        bytes32 indexed tokenHash,
        address indexed verifier,
        string verifierName,
        uint256 verifiedAt
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

    /// @notice Get all verifiers (for admin interface)
    /// @return addresses Array of all verifier addresses
    /// @return nicknames Array of corresponding nicknames
    /// @return authorized Array of authorization status
    /// @return addedAt Array of timestamps when added
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

    /// @notice Issue a ZKP-Visa credential to a user
    /// @param passportNumber The user's passport number
    /// @param tokenHash Hash of the one-time token (generated off-chain)
    /// @param documentVerified Must be true to issue (document verification)
    /// @param paymentConfirmed Must be true to issue (payment confirmation)
    function issueZKPVisa(
        string calldata passportNumber,
        bytes32 tokenHash,
        bool documentVerified,
        bool paymentConfirmed
    ) external onlyOwner {
        if (!documentVerified) revert DocumentNotVerified();
        if (!paymentConfirmed) revert PaymentNotConfirmed();
        if (credentials[tokenHash].exists) revert TokenHashAlreadyExists();

        credentials[tokenHash] = ZKPVisaCredential({
            passportNumber: passportNumber,
            issuedAt: block.timestamp,
            used: false,
            exists: true
        });

        issuedCredentials.push(tokenHash);
        emit ZKPVisaIssued(tokenHash, passportNumber, block.timestamp);
    }

    /// @notice Get all verification logs (for admin dashboard)
    /// @return logs Array of all verification logs
    function getAllVerificationLogs()
        external
        view
        onlyOwner
        returns (VerificationLog[] memory logs)
    {
        return verificationLogs;
    }

    /// @notice Get all issued credentials (for admin dashboard)
    /// @return credentialHashes Array of all issued credential hashes
    function getAllIssuedCredentials()
        external
        view
        onlyOwner
        returns (bytes32[] memory credentialHashes)
    {
        return issuedCredentials;
    }

    /// @notice Get credential details by passport number
    /// @param passportNumber The passport number to search for
    /// @return credential The credential details
    /// @return tokenHash The hash of the found credential
    function getCredentialDetails(
        string calldata passportNumber
    )
        external
        view
        onlyOwner
        returns (ZKPVisaCredential memory credential, bytes32 tokenHash)
    {
        // Search through all issued credentials to find matching passport number
        for (uint256 i = 0; i < issuedCredentials.length; i++) {
            bytes32 currentHash = issuedCredentials[i];
            ZKPVisaCredential storage currentCredential = credentials[
                currentHash
            ];

            // Compare passport numbers (using keccak256 for string comparison)
            if (
                keccak256(bytes(currentCredential.passportNumber)) ==
                keccak256(bytes(passportNumber))
            ) {
                return (currentCredential, currentHash);
            }
        }

        revert CredentialNotFound();
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
    /// @return authorized True if the caller is an authorized verifier
    /// @return nickname The nickname of the verifier (empty string if not authorized)
    /// @return addedAt Timestamp when the verifier was added (0 if not authorized)
    function checkMyStatus()
        external
        view
        returns (bool authorized, string memory nickname, uint256 addedAt)
    {
        VerifierInfo storage info = verifiers[msg.sender];
        return (info.authorized, info.nickname, info.addedAt);
    }

    /// @notice Verify a ZKP-Visa credential from QR code scan
    /// @param token The raw token from the QR code
    /// @return success True if verification successful
    /// @return passportNumber The passport number of the verified credential
    function verifyZKPVisa(
        bytes calldata token
    )
        external
        onlyVerifier
        returns (bool success, string memory passportNumber)
    {
        bytes32 tokenHash = keccak256(token);
        ZKPVisaCredential storage credential = credentials[tokenHash];

        if (!credential.exists) revert CredentialNotFound();
        if (credential.used) revert CredentialAlreadyUsed();

        // Mark as used (one-time verification)
        credential.used = true;

        // Add to verification log
        VerificationLog memory log = VerificationLog({
            credentialHash: tokenHash,
            verifier: msg.sender,
            verifierName: verifiers[msg.sender].nickname,
            verifiedAt: block.timestamp
        });
        verificationLogs.push(log);

        emit ZKPVisaVerified(
            tokenHash,
            msg.sender,
            verifiers[msg.sender].nickname,
            block.timestamp
        );

        return (true, credential.passportNumber);
    }

    // ========================================================================
    // PUBLIC VIEW FUNCTIONS (Anyone Can Call)
    // ========================================================================

    /// @notice Get total number of authorized verifiers
    /// @return count Number of currently authorized verifiers
    function getVerifierCount() external view returns (uint256 count) {
        return verifierList.length;
    }
}
