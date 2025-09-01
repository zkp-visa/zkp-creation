import React from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

interface CompleteScreenProps {
  onRestart: () => void;
  credentials?: {
    requestId: string;
    status: string;
    qrPayload?: string;
    credential?: any;
    userData?: any;
    message?: string;
  };
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({
  onRestart,
  credentials,
}) => {
  // Generate credentials based on backend response or fallback to mock data
  const credentialData = {
    username: credentials?.userData?.email || "john.doe@example.com",
    password: "ZKP_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    walletId:
      credentials?.requestId || "0x" + Math.random().toString(16).substr(2, 40),
    credentialId:
      credentials?.requestId || "ZKP-" + Date.now().toString(36).toUpperCase(),
    blockcertUrl:
      credentials?.qrPayload ||
      "https://api.example.com/blockcert/" +
        Math.random().toString(36).substr(2, 16),
    status: credentials?.status || "completed",
    message: credentials?.message || "Credential created successfully",
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard`);
  };

  const isSuccess = credentialData.status === "completed";

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={5} totalSteps={5} className="mb-4" />

        <div
          className={`${
            isSuccess
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-yellow-50 text-yellow-800 border-yellow-200"
          } border rounded-lg p-4 mb-4`}
          role="alert"
        >
          <div className="text-center">
            <div
              className={`w-16 h-16 ${
                isSuccess
                  ? "bg-green-100 border-green-200"
                  : "bg-yellow-100 border-yellow-200"
              } rounded-full flex items-center justify-center mx-auto mb-4 border-2`}
            >
              <svg
                className={`w-8 h-8 ${
                  isSuccess ? "text-green-600" : "text-yellow-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSuccess ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                )}
              </svg>
            </div>

            <h1
              className={`text-3xl font-bold ${
                isSuccess ? "text-green-900" : "text-yellow-900"
              } mb-2`}
            >
              {isSuccess ? "Congratulations!" : "Processing Complete"}
            </h1>
            <p className={isSuccess ? "text-green-700" : "text-yellow-700"}>
              {credentialData.message}
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
                    {credentialData.username}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentialData.username, "Username")
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
                    {credentialData.password}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentialData.password, "Password")
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
                    Request ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {credentialData.walletId}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credentialData.walletId, "Request ID")
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
                    {credentialData.credentialId}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(
                      credentialData.credentialId,
                      "Credential ID"
                    )
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              {credentialData.blockcertUrl && (
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      QR Code Payload
                    </label>
                    <p className="text-gray-900 font-mono text-xs break-all">
                      {credentialData.blockcertUrl}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Scan this QR code to access your credential
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleCopyToClipboard(
                        credentialData.blockcertUrl,
                        "QR Code Payload"
                      )
                    }
                    variant="secondary"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              )}

              {credentials?.credential && (
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Credential
                    </label>
                    <p className="text-gray-900 font-mono text-xs break-all">
                      {JSON.stringify(credentials.credential, null, 2)}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleCopyToClipboard(
                        JSON.stringify(credentials.credential, null, 2),
                        "Full Credential"
                      )
                    }
                    variant="secondary"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#faf8f0] rounded-lg p-4 mb-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">What's Next?</h3>
            <ul className="text-sm text-[#8b6b2a] space-y-1">
              <li>• Save your credentials in a secure location</li>
              <li>• Use your Request ID to track your credential status</li>
              <li>• Your credentials are now stored on the blockchain</li>
              <li>
                • You can verify your identity without revealing personal data
              </li>
              {credentialData.blockcertUrl && (
                <li>• Scan the QR code to access your credential</li>
              )}
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
