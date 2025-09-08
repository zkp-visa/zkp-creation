"use client";

import Link from "next/link";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ZKP Platform
            </h1>
            <p className="text-gray-600">
              Choose your path to get started with Zero-Knowledge Proofs
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/prover" className="block">
              <Button size="lg" className="w-full">
                Create Visa
              </Button>
            </Link>

            <Link href="/verifier" className="block">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                Manage Verifier
              </Button>
            </Link>
          </div>

          <div className="mt-8 bg-[#faf8f0] rounded-lg p-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">
              Platform Features:
            </h3>
            <ul className="text-sm text-[#8b6b2a] space-y-1">
              <li>• Secure digital credentials</li>
              <li>• Blockchain-based verification</li>
              <li>• Privacy-preserving identity</li>
              <li>• Verifier management system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
