/**
 * File download utilities for ZKP Visa credentials
 */

export interface CredentialFile {
  name: string;
  blob: Blob;
  type: string;
}

/**
 * Download a single file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download all credential files as a package
 */
export function downloadCredentialPackage(
  metadata: Blob,
  commitment: Blob,
  wasm: Blob,
  zkey: Blob,
  passportNumber: string
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const folderName = `zkp-visa-${passportNumber}-${timestamp}`;

  // Create a zip-like structure by downloading files with consistent naming
  const files: CredentialFile[] = [
    {
      name: `${folderName}/credential_metadata.json`,
      blob: metadata,
      type: "application/json",
    },
    {
      name: `${folderName}/commitment.txt`,
      blob: commitment,
      type: "text/plain",
    },
    {
      name: `${folderName}/passport_member.wasm`,
      blob: wasm,
      type: "application/wasm",
    },
    {
      name: `${folderName}/passport_member.zkey`,
      blob: zkey,
      type: "application/octet-stream",
    },
  ];

  // Download each file
  files.forEach((file) => {
    setTimeout(() => {
      downloadFile(file.blob, file.name);
    }, 100); // Small delay between downloads
  });
}

/**
 * Download individual credential files
 */
export function downloadIndividualFiles(
  metadata: Blob,
  commitment: Blob,
  wasm: Blob,
  zkey: Blob
): void {
  const files: CredentialFile[] = [
    {
      name: "credential_metadata.json",
      blob: metadata,
      type: "application/json",
    },
    { name: "commitment.txt", blob: commitment, type: "text/plain" },
    { name: "passport_member.wasm", blob: wasm, type: "application/wasm" },
    {
      name: "passport_member.zkey",
      blob: zkey,
      type: "application/octet-stream",
    },
  ];

  files.forEach((file) => {
    setTimeout(() => {
      downloadFile(file.blob, file.name);
    }, 100);
  });
}

/**
 * Create a data URL from blob for preview
 */
export function createDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
