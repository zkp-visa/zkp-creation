import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

interface AddVerifierScreenProps {
  onAddVerifier: (verifierData: { address: string; nickname: string }) => void;
  onBack: () => void;
  onLogout: () => void;
}

const AddVerifierScreen: React.FC<AddVerifierScreenProps> = ({
  onAddVerifier,
  onBack,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    address: "",
    nickname: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = "Wallet address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address)) {
      newErrors.address = "Please enter a valid Ethereum address (0x...)";
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddVerifier(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Add New Verifier
              </h1>
              <p className="text-gray-600">
                Enter the details for the new verifier
              </p>
            </div>
            <Button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
            >
              Logout
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Wallet Address"
            value={formData.address}
            onChange={(value) => handleInputChange("address", value)}
            placeholder="0x..."
            error={errors.address}
            required
          />

          <Input
            label="Nickname"
            value={formData.nickname}
            onChange={(value) => handleInputChange("nickname", value)}
            placeholder="Enter verifier nickname"
            error={errors.nickname}
            required
          />

          <div className="bg-[#faf8f0] rounded-lg p-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">
              Important Notes:
            </h3>
            <ul className="text-sm text-[#8b6b2a] space-y-1">
              <li>
                • Ensure the wallet address is valid and correctly formatted
              </li>
              <li>• Verify the verifier&apos;s identity before adding</li>
              <li>• This action will be recorded on the blockchain</li>
              <li>• You must be the contract owner to add verifiers</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Add Verifier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVerifierScreen;
