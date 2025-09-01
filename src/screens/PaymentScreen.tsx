import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import ProgressBar from "../components/ProgressBar";
import { PaymentData } from "../types";

interface PaymentScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNext, onBack }) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "4111 1111 1111 1111",
    cardholderName: "John Doe",
    expiryDate: "12/25",
    cvv: "123",
    billingAddress: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const handleFieldChange = (field: keyof PaymentData, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOneTapFill = () => {
    const sampleData: PaymentData = {
      cardNumber: "4111 1111 1111 1111",
      cardholderName: "John Doe",
      expiryDate: "12/25",
      cvv: "123",
      billingAddress: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    };
    setPaymentData(sampleData);
  };

  const handlePay = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");
      setIsProcessing(false);

      // Simulate backend call for blockcert creation
      setTimeout(() => {
        console.log(
          "Calling backend API: https://api.example.com/create-blockcert"
        );
        onNext();
      }, 1000);
    }, 2000);
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
    handleFieldChange("cardNumber", formatted);
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
                <span>ZKP Credential Creation</span>
                <span>$99.00</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>$5.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>$104.00</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <Input
              label="Card Number"
              value={paymentData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cardholder Name"
                value={paymentData.cardholderName}
                onChange={(value) => handleFieldChange("cardholderName", value)}
                required
              />
              <Input
                label="Expiry Date"
                value={paymentData.expiryDate}
                onChange={(value) => handleFieldChange("expiryDate", value)}
                placeholder="MM/YY"
                required
              />
            </div>

            <Input
              label="CVV"
              value={paymentData.cvv}
              onChange={(value) => handleFieldChange("cvv", value)}
              placeholder="123"
              required
            />

            <Input
              label="Billing Address"
              value={paymentData.billingAddress}
              onChange={(value) => handleFieldChange("billingAddress", value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={paymentData.city}
                onChange={(value) => handleFieldChange("city", value)}
                required
              />
              <Input
                label="State"
                value={paymentData.state}
                onChange={(value) => handleFieldChange("state", value)}
                required
              />
              <Input
                label="ZIP Code"
                value={paymentData.zipCode}
                onChange={(value) => handleFieldChange("zipCode", value)}
                required
              />
            </div>
          </div>

          {paymentStatus === "success" && (
            <div
              className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 mb-4"
              role="alert"
            >
              <div className="flex items-center">
                <span className="font-medium">✓ Payment Successful</span>
              </div>
              <p className="text-sm mt-1">
                Your payment has been processed successfully. Creating your ZKP
                credentials...
              </p>
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
            {isProcessing ? "Processing Payment..." : "Pay $104.00"}
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Your payment is secured with SSL encryption</p>
          <p>We never store your credit card information</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
