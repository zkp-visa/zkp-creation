import React from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <ProgressBar currentStep={1} totalSteps={5} className="mb-6" />

        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ZKP Creation Platform
            </h1>
            <p className="text-gray-600">
              Create your Zero-Knowledge Proof credentials in just a few simple
              steps
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-[#faf8f0] rounded-lg p-4 mb-4 border border-[#e6d7b8]">
              <h3 className="font-semibold text-[#8b6b2a] mb-2">
                What you&apos;ll get:
              </h3>
              <ul className="text-sm text-[#8b6b2a] space-y-1">
                <li>• Secure digital credentials</li>
                <li>• Blockchain-based verification</li>
                <li>• Privacy-preserving identity</li>
                <li>• Instant verification capabilities</li>
              </ul>
            </div>
          </div>

          <Button onClick={onStart} size="lg" className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
