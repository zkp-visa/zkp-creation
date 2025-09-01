import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className = "",
}) => {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    "Home",
    "Fill Info",
    "Upload Documents",
    "Payment",
    "Complete",
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index < currentStep ? "text-[#c49c44]" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                index < currentStep
                  ? "bg-[#c49c44] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs text-center">{step}</span>
          </div>
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#c49c44] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
