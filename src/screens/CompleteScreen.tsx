import React from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

interface CompleteScreenProps {
  onRestart: () => void;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ onRestart }) => {
  // Generate mock credentials
  const credentials = {
    username: "john.doe@example.com",
    password: "ZKP_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    walletId: "0x" + Math.random().toString(16).substr(2, 40),
    credentialId: "ZKP-" + Date.now().toString(36).toUpperCase(),
    blockcertUrl:
      "https://api.example.com/blockcert/" +
      Math.random().toString(36).substr(2, 16),
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={5} totalSteps={5} className="mb-4" />

        <div
          className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 mb-4"
          role="alert"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Congratulations!
            </h1>
            <p className="text-green-700">
              Your ZKP credentials have been created successfully
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#faf8f0] rounded-lg p-6 mb-4 border border-[#e6d7b8]">
            <h2 className="text-xl font-semibold text-[#8b6b2a] mb-4">
              Your Credentials
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {credentials.username}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentials.username, "Username")
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {credentials.password}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentials.password, "Password")
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Wallet ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {credentials.walletId}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentials.walletId, "Wallet ID")
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Credential ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {credentials.credentialId}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(
                      credentials.credentialId,
                      "Credential ID"
                    )
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Blockcert URL
                  </label>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {credentials.blockcertUrl}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(
                      credentials.blockcertUrl,
                      "Blockcert URL"
                    )
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#faf8f0] rounded-lg p-4 mb-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">What's Next?</h3>
            <ul className="text-sm text-[#8b6b2a] space-y-1">
              <li>• Save your credentials in a secure location</li>
              <li>• Use your wallet ID to access your ZKP credentials</li>
              <li>• Your credentials are now stored on the blockchain</li>
              <li>
                • You can verify your identity without revealing personal data
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <Button onClick={onRestart} variant="secondary" className="w-full">
            Create Another Credential
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Thank you for using our ZKP Creation Platform</p>
          <p>Your privacy and security are our top priorities</p>
        </div>
      </div>
    </div>
  );
};

export default CompleteScreen;
