import {
  BASE_URL,
  API_ENDPOINTS,
  IssuanceRequest,
  IssuanceResponse,
  CredentialResponse,
  APIErrorResponse,
} from "../data/constants";

class APIService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  // Simple test function to check backend endpoints
  async testBackendEndpoints(): Promise<void> {
    console.log("Testing backend endpoints...");

    // Test the base URL
    try {
      const baseResponse = await fetch(this.baseURL);
      console.log("Base URL response status:", baseResponse.status);
      if (baseResponse.ok) {
        const baseText = await baseResponse.text();
        console.log("Base URL response:", baseText);
      }
    } catch (error) {
      console.error("Base URL test failed:", error);
    }

    // Test the creation endpoint with a simple request
    try {
      const testData = {
        name: "Test User",
        passportNumber: "TEST123",
        nationality: "TEST",
        dob: "2000-01-01",
      };

      const createUrl = `${this.baseURL}${API_ENDPOINTS.CREATE_ISSUANCE_REQUEST}`;
      console.log("Testing creation endpoint:", createUrl);

      const createResponse = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("Creation test response status:", createResponse.status);
      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log("Creation test response:", createData);

        // If creation works, test credential endpoint
        if (createData.requestId) {
          console.log(
            "Testing credential endpoint with requestId:",
            createData.requestId
          );
          const credentialUrl = `${this.baseURL}${API_ENDPOINTS.GET_CREDENTIAL(
            createData.requestId
          )}`;
          console.log("Credential URL:", credentialUrl);

          const credentialResponse = await fetch(credentialUrl);
          console.log(
            "Credential test response status:",
            credentialResponse.status
          );
          if (credentialResponse.ok) {
            const credentialData = await credentialResponse.json();
            console.log("Credential test response:", credentialData);
          } else {
            const credentialText = await credentialResponse.text();
            console.log("Credential test error:", credentialText);
          }
        }
      } else {
        const createText = await createResponse.text();
        console.log("Creation test error:", createText);
      }
    } catch (error) {
      console.error("Creation test failed:", error);
    }
  }

  // Health check to test if backend is accessible
  async healthCheck(): Promise<boolean> {
    try {
      console.log("Testing backend connectivity to:", this.baseURL);
      const response = await fetch(this.baseURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Health check response status:", response.status);
      console.log(
        "Health check response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const text = await response.text();
        console.log("Health check response:", text);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Step A: Create credential and get QR code
  async createIssuanceRequest(
    userData: IssuanceRequest
  ): Promise<IssuanceResponse> {
    try {
      // First, test if backend is accessible
      const isHealthy = await this.healthCheck();
      if (!isHealthy) {
        throw new Error(
          "Backend is not accessible. Please check the URL and try again."
        );
      }

      // Use the correct endpoint
      const fullUrl = `${this.baseURL}${API_ENDPOINTS.CREATE_ISSUANCE_REQUEST}`;
      console.log("Sending issuance request to:", fullUrl);
      console.log("Request data:", userData);

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data: IssuanceResponse = await response.json();
        console.log("Issuance response:", data);
        console.log("RequestId type:", typeof data.requestId);
        console.log("RequestId value:", data.requestId);
        console.log("QR Payload:", data.qrPayload);
        console.log("Full response structure:", JSON.stringify(data, null, 2));
        return data;
      }

      // If endpoint fails, throw error
      let errorMessage = `HTTP error! status: ${response.status}`;
      let responseText = "";

      try {
        responseText = await response.text();
        console.log("Error response text:", responseText);

        if (responseText) {
          try {
            const errorData: APIErrorResponse = JSON.parse(responseText);
            errorMessage = errorData.detail || errorMessage;
          } catch {
            // If it's not JSON, use the text as error message
            errorMessage = responseText || errorMessage;
          }
        }
      } catch (textError) {
        console.warn("Could not read error response text:", textError);
      }

      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        responseText: responseText,
        errorMessage: errorMessage,
      });

      throw new Error(errorMessage);
    } catch (error) {
      console.error("Error creating issuance request:", error);
      throw error;
    }
  }

  // Step B: Get full credential
  async getCredential(requestId: string): Promise<CredentialResponse> {
    try {
      console.log("Fetching credential for requestId:", requestId);

      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.GET_CREDENTIAL(requestId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Credential response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData: APIErrorResponse = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data: CredentialResponse = await response.json();
      console.log("Credential response:", data);
      return data;
    } catch (error) {
      console.error("Error getting credential:", error);
      throw error;
    }
  }
}

export const apiService = new APIService();
export default APIService;
