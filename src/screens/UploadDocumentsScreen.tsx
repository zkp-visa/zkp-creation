import React, { useState } from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { DocumentFile } from "../types";
import {
  REQUIRED_DOCUMENTS,
  VERIFICATION_MESSAGES,
  VERIFICATION_SETTINGS,
  DOCUMENT_STATUS,
  SAMPLE_DOCUMENT_NAMES,
  FILE_SIZE_RANGE,
} from "../data/screens/UploadDocuments";

interface UploadDocumentsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const UploadDocumentsScreen: React.FC<UploadDocumentsScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >(DOCUMENT_STATUS.PENDING);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileUpload = (documentId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const newDocument: DocumentFile = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploaded: true,
    };

    setDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.id !== documentId);
      return [...filtered, newDocument];
    });
  };

  const handleOneTapUpload = () => {
    const sampleDocuments: DocumentFile[] = REQUIRED_DOCUMENTS.map((doc) => ({
      id: doc.id,
      name: doc.name.toLowerCase().replace(" ", "_") + ".pdf",
      type: "application/pdf",
      size:
        Math.floor(
          Math.random() * (FILE_SIZE_RANGE.MAX - FILE_SIZE_RANGE.MIN)
        ) + FILE_SIZE_RANGE.MIN,
      uploaded: true,
    }));

    setDocuments(sampleDocuments);
  };

  const handleVerify = () => {
    setIsVerifying(true);

    // Simulate verification process with 80-20 chance
    setTimeout(() => {
      const isSuccess = Math.random() > 1 - VERIFICATION_SETTINGS.SUCCESS_RATE;
      setVerificationStatus(
        isSuccess ? DOCUMENT_STATUS.SUCCESS : DOCUMENT_STATUS.FAILED
      );
      setIsVerifying(false);

      // Show alert for verification result
      if (isSuccess) {
        alert(VERIFICATION_MESSAGES.SUCCESS);
      } else {
        alert(VERIFICATION_MESSAGES.FAILED);
      }
    }, VERIFICATION_SETTINGS.VERIFICATION_DELAY);
  };

  const isAllDocumentsUploaded = documents.length === REQUIRED_DOCUMENTS.length;
  const canProceed =
    isAllDocumentsUploaded && verificationStatus === DOCUMENT_STATUS.SUCCESS;

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf8f0] to-[#f5f0e0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
        <ProgressBar currentStep={3} totalSteps={5} className="mb-4" />

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Documents
          </h1>
          <p className="text-gray-600">
            Please upload the required documents for verification
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const uploadedDoc = documents.find((d) => d.id === doc.id);

              return (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-gray-700">
                      {doc.name}
                    </label>
                    {uploadedDoc && (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Uploaded
                      </span>
                    )}
                  </div>

                  {!uploadedDoc ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept={doc.type}
                        onChange={(e) =>
                          handleFileUpload(doc.id, e.target.files)
                        }
                        className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#faf8f0] file:text-[#8b6b2a] hover:file:bg-[#e6d7b8]"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {uploadedDoc.name} (
                      {(uploadedDoc.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Button
              onClick={handleOneTapUpload}
              variant="secondary"
              className="flex-1"
            >
              One Tap Upload
            </Button>
            <Button
              onClick={handleVerify}
              disabled={!isAllDocumentsUploaded || isVerifying}
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify Documents"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} disabled={!canProceed} className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsScreen;
