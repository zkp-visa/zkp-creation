export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  occupation: string;
  company: string;
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
