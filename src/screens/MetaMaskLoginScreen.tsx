import React from "react";
import Button from "../components/Button";

interface MetaMaskLoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
  isConnecting?: boolean;
  error?: string | null;
}

const MetaMaskLoginScreen: React.FC<MetaMaskLoginScreenProps> = ({
  onLogin,
  onBack,
  isConnecting = false,
  error,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-gray-600">
              Please connect your MetaMask wallet to access verifier management
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-[#faf8f0] rounded-lg p-4 border border-[#e6d7b8]">
              <h3 className="font-semibold text-[#8b6b2a] mb-2">
                Requirements:
              </h3>
              <ul className="text-sm text-[#8b6b2a] space-y-1 text-left">
                <li>• MetaMask browser extension installed</li>
                <li>• Connected to the correct network</li>
                <li>• Contract owner wallet address</li>
                <li>• Sufficient gas for transactions</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onLogin}
              size="lg"
              className="w-full"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </div>
              ) : (
                "Connect MetaMask"
              )}
            </Button>

            <Button
              onClick={onBack}
              size="lg"
              className="w-full bg-gray-500 hover:bg-gray-600"
              disabled={isConnecting}
            >
              Back to Home
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>
              Don&apos;t have MetaMask?{" "}
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Install it here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskLoginScreen;
