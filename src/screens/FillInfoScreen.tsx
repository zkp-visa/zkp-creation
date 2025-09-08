import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import ProgressBar from "../components/ProgressBar";
import { UserData } from "../types";
import {
  FILL_INFO_FIELDS,
  SAMPLE_USER_DATA_VARIATIONS,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  REQUIRED_FIELDS,
} from "../data/screens/FillInfo";

interface FillInfoScreenProps {
  onNext: (userData: UserData) => void;
  onBack: () => void;
}

const FillInfoScreen: React.FC<FillInfoScreenProps> = ({ onNext, onBack }) => {
  const [userData, setUserData] = useState<UserData>({
    passportNumber: "",
    nickname: "",
  });

  const handleFieldChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOneTapFill = () => {
    // Randomly select one of the variations
    const randomIndex = Math.floor(
      Math.random() * SAMPLE_USER_DATA_VARIATIONS.length
    );
    const selectedData = SAMPLE_USER_DATA_VARIATIONS[randomIndex];
    setUserData(selectedData);
  };

  const handleNext = () => {
    onNext(userData);
  };

  const isFormValid = REQUIRED_FIELDS.every(
    (field) => userData[field as keyof UserData]
  );

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={2} totalSteps={5} className="mb-4" />

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Personal Information
          </h1>
          <p className="text-gray-600">
            Please provide your details to create your ZKP credentials
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label={FIELD_LABELS.PASSPORT_NUMBER}
              value={userData[FILL_INFO_FIELDS.PASSPORT_NUMBER]}
              onChange={(value) =>
                handleFieldChange(FILL_INFO_FIELDS.PASSPORT_NUMBER, value)
              }
              placeholder={FIELD_PLACEHOLDERS.PASSPORT_NUMBER}
              required
            />
            <Input
              label={FIELD_LABELS.NICKNAME}
              value={userData[FILL_INFO_FIELDS.NICKNAME]}
              onChange={(value) =>
                handleFieldChange(FILL_INFO_FIELDS.NICKNAME, value)
              }
              placeholder={FIELD_PLACEHOLDERS.NICKNAME}
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleOneTapFill}
            variant="secondary"
            className="flex-1"
          >
            One Tap Fill
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FillInfoScreen;
