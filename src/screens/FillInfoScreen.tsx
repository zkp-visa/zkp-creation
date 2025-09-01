import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import ProgressBar from "../components/ProgressBar";
import { UserData } from "../types";

interface FillInfoScreenProps {
  onNext: (userData: UserData) => void;
  onBack: () => void;
}

const FillInfoScreen: React.FC<FillInfoScreenProps> = ({ onNext, onBack }) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    occupation: "",
    company: "",
  });

  const handleFieldChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOneTapFill = () => {
    const sampleData: UserData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      occupation: "Software Engineer",
      company: "Tech Corp",
    };
    setUserData(sampleData);
  };

  const handleNext = () => {
    onNext(userData);
  };

  const isFormValid = userData.firstName && userData.lastName && userData.email;

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="First Name"
              value={userData.firstName}
              onChange={(value) => handleFieldChange("firstName", value)}
              required
            />
            <Input
              label="Last Name"
              value={userData.lastName}
              onChange={(value) => handleFieldChange("lastName", value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={userData.email}
              onChange={(value) => handleFieldChange("email", value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={userData.phone}
              onChange={(value) => handleFieldChange("phone", value)}
            />
            <Input
              label="Occupation"
              value={userData.occupation}
              onChange={(value) => handleFieldChange("occupation", value)}
            />
            <Input
              label="Company"
              value={userData.company}
              onChange={(value) => handleFieldChange("company", value)}
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
