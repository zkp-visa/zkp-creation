import React, { useEffect } from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { ZKPCredential } from "../types";
import {
  downloadCredentialPackage,
  downloadIndividualFiles,
} from "../utils/fileDownload";

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
      "ZKP Visa Credential Issued!\n\nYour ZKP Visa credential files have been generated and are ready for download. Download all 4 files: metadata, commitment, .wasm, and .zkey."
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

  const handleDownloadAllFiles = () => {
    if (credential.credentialFiles) {
      downloadCredentialPackage(
        credential.credentialFiles.metadata,
        credential.credentialFiles.commitment,
        credential.credentialFiles.wasm,
        credential.credentialFiles.zkey,
        credential.passportNumber
      );
    }
  };

  const handleDownloadIndividualFiles = () => {
    if (credential.credentialFiles) {
      downloadIndividualFiles(
        credential.credentialFiles.metadata,
        credential.credentialFiles.commitment,
        credential.credentialFiles.wasm,
        credential.credentialFiles.zkey
      );
    }
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

            {/* Download Options */}
            <div className="text-center mb-6">
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadAllFiles}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  📦 Download All Files (Package)
                </Button>
                <Button
                  onClick={handleDownloadIndividualFiles}
                  variant="secondary"
                  className="w-full"
                >
                  📁 Download Individual Files
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Download all 4 required files: metadata, commitment, .wasm, and
                .zkey
              </p>
            </div>

            {/* File Information */}
            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  📄 credential_metadata.json
                </h3>
                <p className="text-sm text-gray-600">
                  Contains: commitment, salt, issuedAt, txHash, merkleRoot
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  📄 commitment.txt
                </h3>
                <p className="text-sm text-gray-600">
                  Contains: commitment hash for verification
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🔧 passport_member.wasm
                </h3>
                <p className="text-sm text-gray-600">
                  WebAssembly circuit file for ZK proof generation
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🔑 passport_member.zkey
                </h3>
                <p className="text-sm text-gray-600">
                  Proving key file for ZK proof generation
                </p>
              </div>
            </div>

            {/* Credential Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Commitment Hash
                  </label>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {credential.tokenHash}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    handleCopyToClipboard(
                      credential.tokenHash,
                      "Commitment Hash"
                    )
                  }
                  variant="secondary"
                  size="sm"
                >
                  Copy
                </Button>
              </div>

              {credential.metadata && (
                <div className="p-3 bg-white rounded border">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Salt
                    </label>
                    <p className="text-gray-900 font-mono text-xs break-all">
                      {credential.metadata.salt}
                    </p>
                  </div>
                </div>
              )}

              {credential.metadata && (
                <div className="p-3 bg-white rounded border">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Merkle Root
                    </label>
                    <p className="text-gray-900 font-mono text-xs break-all">
                      {credential.metadata.merkleRoot}
                    </p>
                  </div>
                </div>
              )}

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
              <li>• Download all 4 credential files to your device securely</li>
              <li>
                • Your ZKP Visa credential is now stored on the blockchain
              </li>
              <li>• Import these files into your ZKP wallet app</li>
              <li>• Use passport + nickname + files to generate ZK proofs</li>
              <li>• Present proofs at airports for verification</li>
              <li>
                • Your credential can be verified without revealing personal
                data
              </li>
              <li>
                • Keep your files secure and don&apos;t share them with others
              </li>
              <li>
                • The salt in metadata.json is essential for proof generation
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
