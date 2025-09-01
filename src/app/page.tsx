"use client";

import { useState } from "react";
import HomeScreen from "../screens/HomeScreen";
import FillInfoScreen from "../screens/FillInfoScreen";
import UploadDocumentsScreen from "../screens/UploadDocumentsScreen";
import PaymentScreen from "../screens/PaymentScreen";
import CompleteScreen from "../screens/CompleteScreen";
import { UserData } from "../types";

type Screen = "home" | "fillInfo" | "uploadDocuments" | "payment" | "complete";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleStart = () => {
    setCurrentScreen("fillInfo");
  };

  const handleFillInfoNext = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("uploadDocuments");
  };

  const handleFillInfoBack = () => {
    setCurrentScreen("home");
  };

  const handleUploadDocumentsNext = () => {
    setCurrentScreen("payment");
  };

  const handleUploadDocumentsBack = () => {
    setCurrentScreen("fillInfo");
  };

  const handlePaymentNext = () => {
    setCurrentScreen("complete");
  };

  const handlePaymentBack = () => {
    setCurrentScreen("uploadDocuments");
  };

  const handleRestart = () => {
    setCurrentScreen("home");
    setUserData(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onStart={handleStart} />;
      case "fillInfo":
        return (
          <FillInfoScreen
            onNext={handleFillInfoNext}
            onBack={handleFillInfoBack}
          />
        );
      case "uploadDocuments":
        return (
          <UploadDocumentsScreen
            onNext={handleUploadDocumentsNext}
            onBack={handleUploadDocumentsBack}
          />
        );
      case "payment":
        return (
          <PaymentScreen
            onNext={handlePaymentNext}
            onBack={handlePaymentBack}
          />
        );
      case "complete":
        return <CompleteScreen onRestart={handleRestart} />;
      default:
        return <HomeScreen onStart={handleStart} />;
    }
  };

  return <main>{renderScreen()}</main>;
}
