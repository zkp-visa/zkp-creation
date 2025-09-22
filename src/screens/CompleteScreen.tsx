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
      "ZKP Visa Credential Issued!\n\nYour ZKP Visa credential files (.wasm and .zkey) have been generated and are ready for download. These files will expire in 5 minutes."
    );
  }, []);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard`);
  };

  const handleDownloadFile = (base64Content: string, filename: string) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatExpiration = (timestamp: number) => {
    const now = Date.now();
    const remaining = timestamp - now;
    if (remaining <= 0) {
      return "Expired";
    }
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={5} totalSteps={5} className="mb-4" />

        <div className="flex-1 overflow-y-auto">
          {/* ZKP Files Download */}
          <div className="bg-[#faf8f0] rounded-lg p-6 mb-4 border border-[#e6d7b8]">
            <h2 className="text-xl font-semibold text-[#8b6b2a] mb-4 text-center">
              Your ZKP Visa Credential Files
            </h2>

            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <img
                  src={credential.qrCode}
                  alt="ZKP Visa Credential QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                QR Code for quick verification
              </p>
            </div>

            {/* File Downloads */}
            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      ZKP Circuit File (.wasm)
                    </h3>
                    <p className="text-sm text-gray-600">
                      WebAssembly circuit for verification
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleDownloadFile(
                        credential.wasmFile,
                        `zkp-visa-${credential.passportNumber}.wasm`
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Download .wasm
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Proving Key File (.zkey)
                    </h3>
                    <p className="text-sm text-gray-600">
                      Proving key for generating proofs
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleDownloadFile(
                        credential.zkeyFile,
                        `zkp-visa-${credential.passportNumber}.zkey`
                      )
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Download .zkey
                  </Button>
                </div>
              </div>
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

              <div className="p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Expires At
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(credential.expiresAt)}
                  </p>
                  <p className="text-xs text-red-600 font-medium">
                    {formatExpiration(credential.expiresAt)}
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
                • Download your .wasm and .zkey files to your phone securely
              </li>
              <li>
                • Your ZKP Visa credential is now stored on the blockchain
              </li>
              <li>• Files will expire in 5 minutes - download them quickly</li>
              <li>• Use these files to generate proofs for verification</li>
              <li>• Present this credential at airports for verification</li>
              <li>
                • Your credential can be verified without revealing personal
                data
              </li>
              <li>
                • Keep your files secure and don&apos;t share them with others
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
