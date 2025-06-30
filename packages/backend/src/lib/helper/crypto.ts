import { createHmac } from "crypto";

/**
 * Generate a secure HMAC signature
 * @param {string} secretKey - The key for algorithm sha-256
 * @param {string} data - The data to sign
 * @returns {string} - The generated signature
 */
export function generateSignature(secretKey: string, data: string): string {
  return createHmac('sha256', secretKey).update(data).digest('hex');
}

/**
 * Verify if a provided signature is valid
 * @param {string} secretKey - The key for algorithm sha-256
 * @param {string} data - The original data
 * @param {string} providedSign - The signature to verify
 * @returns {boolean} - True if the signature is valid, false otherwise
 */
export function verifySignature(secretKey: string, data: string, providedSign: string): boolean {
  const expectedSign = generateSignature(secretKey, data);
  console.log("Sign", expectedSign, "provideSign", providedSign)
  return expectedSign === providedSign;
}