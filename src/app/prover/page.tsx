"use client";

import { useState } from "react";
import HomeScreen from "../../screens/HomeScreen";
import FillInfoScreen from "../../screens/FillInfoScreen";
import UploadDocumentsScreen from "../../screens/UploadDocumentsScreen";
import PaymentScreen from "../../screens/PaymentScreen";
import CompleteScreen from "../../screens/CompleteScreen";
import { UserData } from "../../types";

type Screen = "home" | "fillInfo" | "uploadDocuments" | "payment" | "complete";

export default function ProverPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
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

  const handleStart = () => setCurrentScreen("fillInfo");
  const handleFillInfoNext = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("uploadDocuments");
  };
  const handleUploadNext = () => setCurrentScreen("payment");
  const handlePaymentNext = () => setCurrentScreen("complete");
  const handleRestart = () => {
    setCurrentScreen("home");
    setUserData({
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
  };
  const handleBack = () => {
    switch (currentScreen) {
      case "fillInfo":
        setCurrentScreen("home");
        break;
      case "uploadDocuments":
        setCurrentScreen("fillInfo");
        break;
      case "payment":
        setCurrentScreen("uploadDocuments");
        break;
      default:
        break;
    }
  };

  return (
    <main>
      {currentScreen === "home" && <HomeScreen onStart={handleStart} />}
      {currentScreen === "fillInfo" && (
        <FillInfoScreen onNext={handleFillInfoNext} onBack={handleBack} />
      )}
      {currentScreen === "uploadDocuments" && (
        <UploadDocumentsScreen onNext={handleUploadNext} onBack={handleBack} />
      )}
      {currentScreen === "payment" && (
        <PaymentScreen
          userData={userData}
          onNext={handlePaymentNext}
          onBack={handleBack}
        />
      )}
      {currentScreen === "complete" && (
        <CompleteScreen onRestart={handleRestart} />
      )}
    </main>
  );
}
