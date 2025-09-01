# ZKP Creation Platform

A straightforward multi-step application for creating Zero-Knowledge Proof credentials with a modern, user-friendly interface.

## Features

### 🏠 Home Screen

- Clean landing page with "Get Started" button
- Overview of what users will receive
- Progress indicator showing the 5-step process

### 📝 Fill Information Screen

- Comprehensive form for personal information
- **One Tap Fill** button to automatically populate all fields
- Form validation with required field indicators
- Responsive design for mobile and desktop

### 📄 Upload Documents Screen

- File upload interface for required documents:
  - Government ID
  - Passport
  - Utility Bill
  - Selfie Photo
- **One Tap Upload** button to simulate document uploads
- **Verify Documents** button with 50-50 success/fail simulation
- Real-time upload status and verification feedback

### 💳 Payment Screen

- Pre-filled payment form with sample data
- Order summary with pricing breakdown
- Secure payment processing simulation
- Backend API call simulation for blockcert creation

### ✅ Completion Screen

- Success confirmation with generated credentials
- Copy-to-clipboard functionality for all credentials:
  - Username
  - Password
  - Wallet ID
  - Credential ID
  - Blockcert URL
- Option to create another credential

## Technical Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Custom reusable components
- **State Management**: React useState hooks
- **Type Safety**: Full TypeScript implementation

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application entry point
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Button.tsx        # Reusable button component
│   ├── Input.tsx         # Reusable input component
│   └── ProgressBar.tsx   # Progress indicator component
├── screens/
│   ├── HomeScreen.tsx           # Landing page
│   ├── FillInfoScreen.tsx       # Information form
│   ├── UploadDocumentsScreen.tsx # Document upload
│   ├── PaymentScreen.tsx        # Payment processing
│   └── CompleteScreen.tsx       # Success page
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   ```

## Key Features Implementation

### One Tap Fill

The "One Tap Fill" button automatically populates all form fields with sample data, making it easy to test the application flow.

### One Tap Upload

The "One Tap Upload" button simulates uploading all required documents at once, bypassing the need for actual file selection.

### Document Verification

The verification process has a 50-50 chance of success or failure, simulating real-world verification scenarios.

### Payment Processing

The payment screen includes:

- Pre-filled credit card information
- Order summary with pricing
- Payment processing simulation
- Backend API call simulation for blockcert creation

### Credential Generation

Upon successful completion, the system generates:

- Unique username and password
- Ethereum-style wallet ID
- Credential ID
- Blockcert URL (dummy endpoint)

## Customization

### Adding New Fields

To add new fields to the information form, update the `UserData` interface in `src/types/index.ts` and modify the `FillInfoScreen.tsx` component.

### Modifying Document Requirements

Update the `requiredDocuments` array in `UploadDocumentsScreen.tsx` to change the required document types.

### Changing Pricing

Modify the pricing information in `PaymentScreen.tsx` to update the order summary.

### Backend Integration

The application now integrates with a ZKP backend API through three main endpoints:

#### API Configuration

1. **Set your backend URL** in `src/data/constants.ts`:

   ```typescript
   export const BASE_URL = "https://your-actual-backend-url.com";
   ```

2. **Or use environment variable**:
   Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-actual-backend-url.com
   ```

#### API Flow

The payment screen follows a 3-step process:

1. **Step A - Create Issuance Request**

   - `POST /apis/creation/issuance/request`
   - Submits user data (name, passport, nationality, DOB)
   - Returns `{ requestId, status: "pending" }`

2. **Step B - Poll Status**

   - `GET /apis/creation/issuance/status/{requestId}`
   - Polls until status becomes "completed" or "failed"
   - Returns `{ requestId, status, qrPayload? }`

3. **Step C - Get Credential (Optional)**
   - `GET /apis/creation/credential/{requestId}`
   - Fetches the full Verifiable Credential JSON
   - Returns `{ vc: {...} }`

#### Files Created

- `src/data/constants.ts` - API endpoints and types
- `src/services/api.ts` - API service with polling logic
- Updated `src/screens/PaymentScreen.tsx` - Integrated backend calls

#### Error Handling

The application includes comprehensive error handling:

- Network errors are caught and displayed
- Failed API calls show user-friendly messages
- Polling timeout protection (30 attempts, 2-second intervals)
- Request ID tracking for debugging

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Notes

- The application uses client-side state management for simplicity
- All data is stored in memory and resets on page refresh
- File uploads are simulated and don't actually store files
- Payment processing is simulated for demonstration purposes
- The backend API call is logged to the console for debugging

## License

This project is open source and available under the MIT License.
