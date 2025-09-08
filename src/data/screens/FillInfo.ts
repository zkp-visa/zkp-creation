// FillInfo Screen Constants

export const FILL_INFO_FIELDS = {
  PASSPORT_NUMBER: "passportNumber",
  NICKNAME: "nickname",
} as const;

export const SAMPLE_USER_DATA_VARIATIONS = [
  {
    passportNumber: "E1234567",
    nickname: "Alice",
  },
  {
    passportNumber: "A9876543",
    nickname: "John",
  },
  {
    passportNumber: "B5678901",
    nickname: "Maria",
  },
] as const;

export const FIELD_LABELS = {
  PASSPORT_NUMBER: "Passport Number",
  NICKNAME: "Nickname",
} as const;

export const FIELD_PLACEHOLDERS = {
  PASSPORT_NUMBER: "e.g., E1234567, A9876543",
  NICKNAME: "e.g., Alice, John, Maria",
} as const;

export const REQUIRED_FIELDS = [
  FILL_INFO_FIELDS.PASSPORT_NUMBER,
  FILL_INFO_FIELDS.NICKNAME,
] as const;
