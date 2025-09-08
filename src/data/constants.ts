// API Configuration
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://zkp-backend.onrender.com";

// API Endpoints - Updated to match correct implementation
export const API_ENDPOINTS = {
  // Step A: Create credential and get QR code
  CREATE_ISSUANCE_REQUEST: "/apis/creation/issue",

  // Step B: Get full credential
  GET_CREDENTIAL: (requestId: string) =>
    `/apis/creation/credential/${requestId}`,
};

// API Request/Response Types based on backend documentation
export interface IssuanceRequest {
  name: string;
  passportNumber: string;
  nationality: string;
  dob: string;
}

export interface IssuanceResponse {
  requestId: string;
  qrPayload: string;
}

export interface CredentialResponse {
  vc: Record<string, unknown>; // The full Verifiable Credential JSON
}

// Error response type
export interface APIErrorResponse {
  detail: string;
  status_code: number;
}
