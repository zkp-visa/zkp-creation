import React from "react";
import Button from "../components/Button";
import { Verifier } from "../types";

interface VerifierListScreenProps {
  verifiers: Verifier[];
  onAddVerifier: () => void;
  onRevokeVerifier: (verifierAddress: string) => void;
  onBack: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const VerifierListScreen: React.FC<VerifierListScreenProps> = ({
  verifiers,
  onAddVerifier,
  onRevokeVerifier,
  onBack,
  onLogout,
  isLoading = false,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(); // Convert from seconds to milliseconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Verifier Management
              </h1>
              <p className="text-gray-600">Manage your authorized verifiers</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Back
              </Button>
              <Button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
              <Button onClick={onAddVerifier}>Add Verifier</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading verifiers...
                </h3>
                <p className="text-gray-600">
                  Fetching data from the blockchain
                </p>
              </div>
            </div>
          ) : verifiers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No verifiers found
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first verifier
                </p>
                <Button onClick={onAddVerifier}>Add Your First Verifier</Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Nickname
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Wallet Address
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Added
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {verifiers.map((verifier) => (
                    <tr
                      key={verifier.address}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {verifier.nickname}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                        <span title={verifier.address}>
                          {verifier.address.slice(0, 6)}...
                          {verifier.address.slice(-4)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            verifier.authorized
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {verifier.authorized ? "Active" : "Revoked"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(verifier.addedAt)}
                      </td>
                      <td className="py-3 px-4">
                        {verifier.authorized ? (
                          <Button
                            onClick={() => onRevokeVerifier(verifier.address)}
                            className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
                          >
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">Revoked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifierListScreen;
