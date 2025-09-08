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
    error ZeroAddress();
    error VerifierAlreadyExists();
    error VerifierNotFound();

    // -------- Access Control --------

    /// @notice Admin (Contract Deployer) - Manages the verifier system
    address public owner;
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // -------- Verifier Management --------

    /// @notice Verifier information structure
    struct VerifierInfo {
        string nickname; // Human-readable name for the verifier
        bool authorized; // Authorization status
        uint256 addedAt; // Timestamp when added
    }

    /// @notice Mapping from verifier address to their information
    mapping(address => VerifierInfo) public verifiers;

    /// @notice Array to keep track of all verifier addresses for enumeration
    address[] public verifierList;

    // -------- Events --------
    event VerifierAdded(address indexed verifier, string nickname);
    event VerifierRevoked(address indexed verifier, string nickname);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // -------- Constructor --------
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // -------- Admin Functions (Contract Deployer Only) --------

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

    /// @notice Transfer ownership (admin role)
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // -------- Verifier Functions --------

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

    /// @notice Get total number of authorized verifiers
    /// @return count Number of currently authorized verifiers
    function getVerifierCount() external view returns (uint256 count) {
        return verifierList.length;
    }
}
