export interface UserData {
  passportNumber: string;
  nickname: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded: boolean;
}

export interface PaymentData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Credentials {
  username: string;
  password: string;
  walletId: string;
  credentialId: string;
  blockcertUrl: string;
}

export interface Verifier {
  address: string; // Wallet address (used as ID)
  nickname: string; // Name from smart contract
  authorized: boolean; // Authorization status from smart contract
  addedAt: number; // Timestamp from smart contract (in seconds)
}

export interface ZKPCredential {
  tokenHash: string;
  passportNumber: string;
  issuedAt: number;
  qrCode: string; // Base64 encoded QR code
}
