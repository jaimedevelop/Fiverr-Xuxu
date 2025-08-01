export interface VerificationData {
  email: string;
  verificationCode: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
}