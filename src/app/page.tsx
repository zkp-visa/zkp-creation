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
  return <main>Hi</main>;
}
