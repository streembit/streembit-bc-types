export declare enum AttestationType {
    IDENTITY = "identity",
    EMAIL = "email",
    MOBILE = "mobile",
    ADDRESS = "address",
    AGE = "age",
    CASHPAID = "cashpaid",
    FUNDAVAILABLE = "fundavailable"
}
export interface AttestationBase {
    type: AttestationType;
    issuerNodeId: string;
    issuedAt: number;
    expiresAt?: number;
    issuerPublicKey: string;
    signature: string;
}
export interface IdentityAttestation extends AttestationBase {
    type: AttestationType.IDENTITY;
}
export interface EmailAddressAttestation extends AttestationBase {
    type: AttestationType.EMAIL;
}
export interface AddressAttestation extends AttestationBase {
    type: AttestationType.ADDRESS;
}
export interface AgeAttestation extends AttestationBase {
    type: AttestationType.AGE;
}
export interface MobileNumberAttestation extends AttestationBase {
    type: AttestationType.MOBILE;
}
export interface CashPaidAttestation extends AttestationBase {
    type: AttestationType.CASHPAID;
    currency: string;
    amount: string;
    paidAt: number;
}
export interface FundAvailableAttestation extends AttestationBase {
    type: AttestationType.FUNDAVAILABLE;
    currency: string;
    amount: string;
    expiryDate: number;
}
export type Attestation = IdentityAttestation | EmailAddressAttestation | AddressAttestation | AgeAttestation | MobileNumberAttestation | CashPaidAttestation | FundAvailableAttestation;
export interface AttestationVerificationResult {
    attestation: Attestation;
    isValid: boolean;
    error?: string;
}
export interface AttestationCipherData {
    cipherText: string;
    issuerNodeId: string;
    issuerPublicKey: string;
    auth_tag: string;
}
//# sourceMappingURL=attestation.d.ts.map