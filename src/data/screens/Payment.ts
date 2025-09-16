// Payment Screen Constants

export const PAYMENT_FIELDS = {
  CARD_NUMBER: "cardNumber",
  CARDHOLDER_NAME: "cardholderName",
  EXPIRY_DATE: "expiryDate",
  CVV: "cvv",
  BILLING_ADDRESS: "billingAddress",
  CITY: "city",
  STATE: "state",
  ZIP_CODE: "zipCode",
} as const;

export const SAMPLE_PAYMENT_DATA_VARIATIONS = [
  {
    cardNumber: "4111 1111 1111 1111",
    cardholderName: "John Doe",
    expiryDate: "12/25",
    cvv: "123",
    billingAddress: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
  {
    cardNumber: "5555 4444 3333 2222",
    cardholderName: "Sarah Johnson",
    expiryDate: "09/26",
    cvv: "456",
    billingAddress: "456 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
  },
  {
    cardNumber: "3782 822463 10005",
    cardholderName: "Michael Chen",
    expiryDate: "03/27",
    cvv: "789",
    billingAddress: "789 Pine Road",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
  },
] as const;

export const FIELD_LABELS = {
  CARD_NUMBER: "Card Number",
  CARDHOLDER_NAME: "Cardholder Name",
  EXPIRY_DATE: "Expiry Date",
  CVV: "CVV",
  BILLING_ADDRESS: "Billing Address",
  CITY: "City",
  STATE: "State",
  ZIP_CODE: "ZIP Code",
} as const;

export const FIELD_PLACEHOLDERS = {
  CARD_NUMBER: "1234 5678 9012 3456",
  CARDHOLDER_NAME: "John Doe",
  EXPIRY_DATE: "MM/YY",
  CVV: "123",
  BILLING_ADDRESS: "123 Main Street",
  CITY: "New York",
  STATE: "NY",
  ZIP_CODE: "10001",
} as const;

export const ORDER_SUMMARY = {
  CREDENTIAL_CREATION: "ZKP Credential Creation",
  PROCESSING_FEE: "Processing Fee",
  TOTAL: "Total",
  CREDENTIAL_PRICE: "1,900 AED",
  FEE_AMOUNT: "100 AED",
  TOTAL_AMOUNT: "2,000 AED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
} as const;

export const PAYMENT_MESSAGES = {
  PROCESSING: "Processing Payment...",
  PAY_BUTTON: "Pay 2,000 AED",
  SUCCESS_TITLE: "✓ Payment Successful",
  SUCCESS_MESSAGE:
    "Payment processed successfully. Creating your ZKP credentials...",
  FAILED_TITLE: "✗ Processing Failed",
} as const;

export const PROCESSING_DELAYS = {
  PAYMENT_SIMULATION: 2000, // 2 seconds
  BACKEND_CALL: 1000, // 1 second
} as const;

export const SECURITY_MESSAGES = {
  SSL_ENCRYPTION: "Your payment is secured with SSL encryption",
  NO_STORAGE: "We never store your credit card information",
} as const;
