// FillInfo Screen Constants

export const FILL_INFO_FIELDS = {
  PASSPORT_NUMBER: "passportNumber",
  NICKNAME: "nickname",
  DURATION: "duration",
} as const;

export const SAMPLE_USER_DATA_VARIATIONS = [
  {
    passportNumber: "E1234567",
    nickname: "Alice",
    duration: 5, // 5 minutes
  },
  {
    passportNumber: "A9876543",
    nickname: "John",
    duration: 5, // 5 minutes
  },
  {
    passportNumber: "B5678901",
    nickname: "Maria",
    duration: 5, // 5 minutes
  },
] as const;

export const FIELD_LABELS = {
  PASSPORT_NUMBER: "Passport Number",
  NICKNAME: "Nickname",
  DURATION: "Duration (minutes)",
} as const;

export const FIELD_PLACEHOLDERS = {
  PASSPORT_NUMBER: "e.g., E1234567, A9876543",
  NICKNAME: "e.g., Alice, John, Maria",
  DURATION: "5",
} as const;

export const REQUIRED_FIELDS = [
  FILL_INFO_FIELDS.PASSPORT_NUMBER,
  FILL_INFO_FIELDS.NICKNAME,
  FILL_INFO_FIELDS.DURATION,
] as const;
