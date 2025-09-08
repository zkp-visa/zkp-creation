import React, { useEffect } from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { ZKPCredential } from "../types";

interface CompleteScreenProps {
  onRestart: () => void;
  credential: ZKPCredential;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({
  onRestart,
  credential,
}) => {
  // Show popup alert when component mounts
  useEffect(() => {
    alert(
      "ZKP Visa Credential Issued!\n\nYour ZKP Visa credential has been successfully created and stored on the blockchain."
    );
  }, []);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={5} totalSteps={5} className="mb-4" />

        <div className="flex-1 overflow-y-auto">
          {/* QR Code Display */}
          <div className="bg-[#faf8f0] rounded-lg p-6 mb-4 border border-[#e6d7b8]">
            <h2 className="text-xl font-semibold text-[#8b6b2a] mb-4 text-center">
              Your ZKP Visa Credential
            </h2>

            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <img
                  src={credential.qrCode}
                  alt="ZKP Visa Credential QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scan this QR code with a camera to download your credential
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Token Hash
                  </label>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {credential.tokenHash}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(credential.tokenHash, "Token Hash")
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              <div className="p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Issued At
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(credential.issuedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#faf8f0] rounded-lg p-4 mb-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">
              What&apos;s Next?
            </h3>
            <ul className="text-sm text-[#8b6b2a] space-y-1">
              <li>
                • Your ZKP Visa credential is now stored on the blockchain
              </li>
              <li>
                • Scan the QR code with a camera to download your credential
              </li>
              <li>• Present this credential at airports for verification</li>
              <li>
                • Your credential can be verified without revealing personal
                data
              </li>
              <li>
                • Keep your credential secure and don't share it with others
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
