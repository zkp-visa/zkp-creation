import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import ProgressBar from "../components/ProgressBar";
import { PaymentData, UserData } from "../types";
import { apiService } from "../services/api";
import { IssuanceRequest } from "../data/constants";
import {
  PAYMENT_FIELDS,
  SAMPLE_PAYMENT_DATA_VARIATIONS,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  ORDER_SUMMARY,
  PAYMENT_STATUS,
  PAYMENT_MESSAGES,
  PROCESSING_DELAYS,
  SECURITY_MESSAGES,
} from "../data/screens/Payment";

interface PaymentScreenProps {
  onNext: (credentials: any) => void;
  onBack: () => void;
  userData: UserData;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onNext,
  onBack,
  userData,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >(PAYMENT_STATUS.PENDING);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");

  const handleFieldChange = (field: keyof PaymentData, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOneTapFill = () => {
    // Randomly select one of the variations
    const randomIndex = Math.floor(
      Math.random() * SAMPLE_PAYMENT_DATA_VARIATIONS.length
    );
    const selectedData = SAMPLE_PAYMENT_DATA_VARIATIONS[randomIndex];
    setPaymentData(selectedData);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    setProcessingStep("Processing payment...");

    try {
      // Test backend endpoints first
      console.log("Testing backend endpoints...");
      await apiService.testBackendEndpoints();

      // Simulate payment processing first
      await new Promise((resolve) =>
        setTimeout(resolve, PROCESSING_DELAYS.PAYMENT_SIMULATION)
      );
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
      setProcessingStep("Payment successful! Creating ZKP credentials...");

      // Prepare issuance request data
      const issuanceData: IssuanceRequest = {
        name: `${userData.firstName} ${userData.lastName}`,
        passportNumber: userData.phone, // This should be the actual passport number
        nationality: userData.state, // This should be the actual nationality
        dob: userData.dateOfBirth, // This should be the actual date of birth
      };

      console.log("Creating issuance request...", issuanceData);
      console.log(
        "Request body format:",
        JSON.stringify(issuanceData, null, 2)
      );
      setProcessingStep("Submitting data to backend...");

      // Step A: Create issuance request and get QR code
      const issuanceResponse = await apiService.createIssuanceRequest(
        issuanceData
      );
      setRequestId(issuanceResponse.requestId);
      setProcessingStep(
        `Credential created! ID: ${issuanceResponse.requestId}. Getting full credential...`
      );

      console.log("Issuance request created:", issuanceResponse);

      // Step B: Get full credential (optional)
      let credential = null;
      try {
        setProcessingStep("Retrieving credential details...");
        credential = await apiService.getCredential(issuanceResponse.requestId);
        console.log("Full credential retrieved:", credential);
        setProcessingStep("Credential retrieved successfully!");
      } catch (credError) {
        console.warn("Could not retrieve full credential:", credError);
        setProcessingStep(
          "Credential created but could not retrieve full details."
        );
      }

      // Pass the results to the next screen
      const results = {
        requestId: issuanceResponse.requestId,
        qrPayload: issuanceResponse.qrPayload,
        credential: credential?.vc,
        userData: userData,
        status: "completed", // Since we get QR code immediately, it's completed
      };

      onNext(results);
    } catch (error) {
      console.error("Payment/Issuance error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during processing";
      setError(errorMessage);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setProcessingStep("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleFieldChange(PAYMENT_FIELDS.CARD_NUMBER, formatted);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={4} totalSteps={5} className="mb-4" />

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Information
          </h1>
          <p className="text-gray-600">
            Complete your payment to create your ZKP credentials
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#faf8f0] rounded-lg p-4 mb-4 border border-[#e6d7b8]">
            <h3 className="font-semibold text-[#8b6b2a] mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{ORDER_SUMMARY.CREDENTIAL_CREATION}</span>
                <span>{ORDER_SUMMARY.CREDENTIAL_PRICE}</span>
              </div>
              <div className="flex justify-between">
                <span>{ORDER_SUMMARY.PROCESSING_FEE}</span>
                <span>{ORDER_SUMMARY.FEE_AMOUNT}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>{ORDER_SUMMARY.TOTAL}</span>
                <span>{ORDER_SUMMARY.TOTAL_AMOUNT}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <Input
              label={FIELD_LABELS.CARD_NUMBER}
              value={paymentData[PAYMENT_FIELDS.CARD_NUMBER]}
              onChange={handleCardNumberChange}
              placeholder={FIELD_PLACEHOLDERS.CARD_NUMBER}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={FIELD_LABELS.CARDHOLDER_NAME}
                value={paymentData[PAYMENT_FIELDS.CARDHOLDER_NAME]}
                onChange={(value) =>
                  handleFieldChange(PAYMENT_FIELDS.CARDHOLDER_NAME, value)
                }
                placeholder={FIELD_PLACEHOLDERS.CARDHOLDER_NAME}
                required
              />
              <Input
                label={FIELD_LABELS.EXPIRY_DATE}
                value={paymentData[PAYMENT_FIELDS.EXPIRY_DATE]}
                onChange={(value) =>
                  handleFieldChange(PAYMENT_FIELDS.EXPIRY_DATE, value)
                }
                placeholder={FIELD_PLACEHOLDERS.EXPIRY_DATE}
                required
              />
            </div>

            <Input
              label={FIELD_LABELS.CVV}
              value={paymentData[PAYMENT_FIELDS.CVV]}
              onChange={(value) => handleFieldChange(PAYMENT_FIELDS.CVV, value)}
              placeholder={FIELD_PLACEHOLDERS.CVV}
              required
            />

            <Input
              label={FIELD_LABELS.BILLING_ADDRESS}
              value={paymentData[PAYMENT_FIELDS.BILLING_ADDRESS]}
              onChange={(value) =>
                handleFieldChange(PAYMENT_FIELDS.BILLING_ADDRESS, value)
              }
              placeholder={FIELD_PLACEHOLDERS.BILLING_ADDRESS}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={FIELD_LABELS.CITY}
                value={paymentData[PAYMENT_FIELDS.CITY]}
                onChange={(value) =>
                  handleFieldChange(PAYMENT_FIELDS.CITY, value)
                }
                placeholder={FIELD_PLACEHOLDERS.CITY}
                required
              />
              <Input
                label={FIELD_LABELS.STATE}
                value={paymentData[PAYMENT_FIELDS.STATE]}
                onChange={(value) =>
                  handleFieldChange(PAYMENT_FIELDS.STATE, value)
                }
                placeholder={FIELD_PLACEHOLDERS.STATE}
                required
              />
              <Input
                label={FIELD_LABELS.ZIP_CODE}
                value={paymentData[PAYMENT_FIELDS.ZIP_CODE]}
                onChange={(value) =>
                  handleFieldChange(PAYMENT_FIELDS.ZIP_CODE, value)
                }
                placeholder={FIELD_PLACEHOLDERS.ZIP_CODE}
                required
              />
            </div>
          </div>

          {isProcessing && processingStep && (
            <div
              className="bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4 mb-4"
              role="alert"
            >
              <div className="flex items-center">
                <span className="font-medium">Processing...</span>
              </div>
              <p className="text-sm mt-1">{processingStep}</p>
            </div>
          )}

          {paymentStatus === PAYMENT_STATUS.SUCCESS && !isProcessing && (
            <div
              className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 mb-4"
              role="alert"
            >
              <div className="flex items-center">
                <span className="font-medium">
                  {PAYMENT_MESSAGES.SUCCESS_TITLE}
                </span>
              </div>
              <p className="text-sm mt-1">
                {PAYMENT_MESSAGES.SUCCESS_MESSAGE}
                {requestId && (
                  <>
                    <br />
                    Request ID:{" "}
                    <code className="font-mono text-xs">{requestId}</code>
                  </>
                )}
              </p>
            </div>
          )}

          {paymentStatus === PAYMENT_STATUS.FAILED && error && (
            <div
              className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-4"
              role="alert"
            >
              <div className="flex items-center">
                <span className="font-medium">
                  {PAYMENT_MESSAGES.FAILED_TITLE}
                </span>
              </div>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            onClick={onBack}
            variant="secondary"
            disabled={isProcessing}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleOneTapFill}
            variant="secondary"
            disabled={isProcessing}
            className="flex-1"
          >
            One Tap Fill
          </Button>
          <Button
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing
              ? PAYMENT_MESSAGES.PROCESSING
              : PAYMENT_MESSAGES.PAY_BUTTON}
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>{SECURITY_MESSAGES.SSL_ENCRYPTION}</p>
          <p>{SECURITY_MESSAGES.NO_STORAGE}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
