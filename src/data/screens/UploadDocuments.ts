// UploadDocuments Screen Constants

export const REQUIRED_DOCUMENTS = [
  { id: "id", name: "Government ID", type: "image/*,.pdf" },
  { id: "selfie", name: "Selfie Photo", type: "image/*" },
] as const;

export const VERIFICATION_MESSAGES = {
  SUCCESS:
    "✓ Verification Successful! All documents have been verified successfully.",
  FAILED:
    "✗ Verification Failed! Some documents could not be verified. Please try again.",
} as const;

export const VERIFICATION_SETTINGS = {
  SUCCESS_RATE: 0.8, // 80% success rate
  VERIFICATION_DELAY: 2000, // 2 seconds
} as const;

export const DOCUMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
} as const;

export const SAMPLE_DOCUMENT_NAMES = {
  GOVERNMENT_ID: "government_id.pdf",
  SELFIE: "selfie_photo.pdf",
} as const;

export const FILE_SIZE_RANGE = {
  MIN: 50000, // 50KB
  MAX: 1000000, // 1MB
} as const;
