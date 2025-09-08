"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VerifierListScreen from "../../screens/VerifierListScreen";
import AddVerifierScreen from "../../screens/AddVerifierScreen";
import MetaMaskLoginScreen from "../../screens/MetaMaskLoginScreen";
import { Verifier } from "../../types";
import { blockchainService } from "../../services/blockchain";

type VerifierScreen = "login" | "list" | "add";

export default function VerifierPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<VerifierScreen>("login");
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const initialized = await blockchainService.initialize();

      if (!initialized) {
        setError("Failed to connect to wallet. Please install MetaMask.");
        return;
      }

      const isOwner = await blockchainService.isOwner();
      if (!isOwner) {
        setError(
          "You are not authorized to manage verifiers. Only the contract owner can access this page."
        );
        return;
      }

      // Successfully connected and authorized
      setCurrentScreen("list");
      await loadVerifiers();
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to wallet"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const loadVerifiers = async () => {
    try {
      const verifiersData = await blockchainService.getAllVerifiers();
      setVerifiers(verifiersData);
      setError(null);
    } catch (err: unknown) {
      console.error("Error loading verifiers:", err);
      setError("Failed to load verifiers from blockchain");
    }
  };

  const handleAddVerifier = async (verifierData: {
    address: string;
    nickname: string;
  }) => {
    try {
      setIsLoading(true);
      await blockchainService.addVerifier(
        verifierData.address,
        verifierData.nickname
      );
      await loadVerifiers(); // Reload verifiers from blockchain
      setCurrentScreen("list");
      alert("Verifier added successfully!");
    } catch (err: unknown) {
      console.error("Error adding verifier:", err);
      alert(
        `Failed to add verifier: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeVerifier = async (verifierAddress: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this verifier? This action will be recorded on the blockchain."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await blockchainService.revokeVerifier(verifierAddress);
      await loadVerifiers(); // Reload verifiers from blockchain
      alert("Verifier revoked successfully!");
    } catch (err: unknown) {
      console.error("Error revoking verifier:", err);
      alert(
        `Failed to revoke verifier: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await blockchainService.logout();
      setCurrentScreen("login");
      setVerifiers([]);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Force logout even if there's an error
      setCurrentScreen("login");
      setVerifiers([]);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentScreen === "add") {
      setCurrentScreen("list");
    } else {
      router.push("/");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Error
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Troubleshooting:
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure you&apos;re on the correct network</li>
                <li>
                  • Contract is deployed on:{" "}
                  <span className="font-mono text-xs">
                    0x00f763AE66cEaD26C51C1f5f1a9d7573f6338a1F
                  </span>
                </li>
                <li>• You&apos;re currently on: Scroll Sepolia</li>
                <li>• Check if contract exists on this network</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex-1"
              >
                Go Back
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      {currentScreen === "login" && (
        <MetaMaskLoginScreen
          onLogin={handleLogin}
          onBack={() => router.push("/")}
          isConnecting={isConnecting}
          error={error}
        />
      )}
      {currentScreen === "list" && (
        <VerifierListScreen
          verifiers={verifiers}
          onAddVerifier={() => setCurrentScreen("add")}
          onRevokeVerifier={handleRevokeVerifier}
          onBack={handleBack}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
      )}
      {currentScreen === "add" && (
        <AddVerifierScreen
          onAddVerifier={handleAddVerifier}
          onBack={handleBack}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}
