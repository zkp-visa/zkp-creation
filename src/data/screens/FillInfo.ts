// FillInfo Screen Constants

export const FILL_INFO_FIELDS = {
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  PASSPORT_NUMBER: "phone", // Using phone field for passport number
  NATIONALITY: "state", // Using state field for nationality
  DATE_OF_BIRTH: "dateOfBirth",
} as const;

export const SAMPLE_USER_DATA_VARIATIONS = [
  {
    firstName: "Alice",
    lastName: "Tan",
    email: "alice.tan@example.com",
    phone: "E1234567",
    dateOfBirth: "1999-05-12",
    address: "123 Main Street",
    city: "Singapore",
    state: "SGP",
    zipCode: "123456",
    occupation: "Software Engineer",
    company: "Tech Corp",
  },
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "A9876543",
    dateOfBirth: "1985-12-03",
    address: "456 Oak Avenue",
    city: "New York",
    state: "US",
    zipCode: "10001",
    occupation: "Marketing Manager",
    company: "Digital Solutions Inc",
  },
  {
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phone: "B5678901",
    dateOfBirth: "1992-08-22",
    address: "789 Pine Road",
    city: "Madrid",
    state: "ESP",
    zipCode: "28001",
    occupation: "Data Scientist",
    company: "Analytics Pro",
  },
] as const;

export const FIELD_LABELS = {
  FIRST_NAME: "First Name",
  LAST_NAME: "Last Name",
  PASSPORT_NUMBER: "Passport Number",
  NATIONALITY: "Nationality",
  DATE_OF_BIRTH: "Date of Birth",
} as const;

export const FIELD_PLACEHOLDERS = {
  PASSPORT_NUMBER: "e.g., E1234567, A9876543",
  NATIONALITY: "e.g., SGP, US, ESP, UK, CA",
  DATE_OF_BIRTH: "YYYY-MM-DD (e.g., 1999-05-12)",
} as const;

export const REQUIRED_FIELDS = [
  FILL_INFO_FIELDS.FIRST_NAME,
  FILL_INFO_FIELDS.LAST_NAME,
  FILL_INFO_FIELDS.PASSPORT_NUMBER,
  FILL_INFO_FIELDS.DATE_OF_BIRTH,
  FILL_INFO_FIELDS.NATIONALITY,
] as const;
