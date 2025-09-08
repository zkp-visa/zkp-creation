"use client";

import { useState } from "react";
import HomeScreen from "../../screens/HomeScreen";
import FillInfoScreen from "../../screens/FillInfoScreen";
import UploadDocumentsScreen from "../../screens/UploadDocumentsScreen";
import PaymentScreen from "../../screens/PaymentScreen";
import CompleteScreen from "../../screens/CompleteScreen";
import { UserData, ZKPCredential } from "../../types";

type Screen = "home" | "fillInfo" | "uploadDocuments" | "payment" | "complete";

export default function ProverPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [userData, setUserData] = useState<UserData>({
    passportNumber: "",
    nickname: "",
  });
  const [documentVerified, setDocumentVerified] = useState(false);
  const [credential, setCredential] = useState<ZKPCredential | null>(null);

  const handleStart = () => setCurrentScreen("fillInfo");
  const handleFillInfoNext = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("uploadDocuments");
  };
  const handleUploadNext = () => {
    setDocumentVerified(true);
    setCurrentScreen("payment");
  };
  const handlePaymentNext = (cred: ZKPCredential) => {
    setCredential(cred);
    setCurrentScreen("complete");
  };
  const handleRestart = () => {
    setCurrentScreen("home");
    setUserData({
      passportNumber: "",
      nickname: "",
    });
    setDocumentVerified(false);
    setCredential(null);
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
          documentVerified={documentVerified}
          onNext={handlePaymentNext}
          onBack={handleBack}
        />
      )}
      {currentScreen === "complete" && credential && (
        <CompleteScreen credential={credential} onRestart={handleRestart} />
      )}
    </main>
  );
}
