// Attestation types

import { createPublicKey } from "crypto";

export enum AttestationType {
    IDENTITY = 'identity',
    EMAIL = 'email',
    MOBILE = 'mobile',
    ADDRESS = 'address',
    AGE = 'age',
    CASHPAID = 'cashpaid',
    FUNDAVAILABLE = 'fundavailable',
}

export interface AttestationBase {
    type: AttestationType;
    issuerNodeId: string; // NodeId of the attestation issuer
    issuedAt: number; // Timestamp of issuance
    expiresAt?: number; // Optional expiration timestamp
    issuerPublicKey: string; // Public key of the issuer    
    signature: string; // Digital signature of the issuer
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
    currency: string; // Currency of the amount paid
    amount: string; // Amount paid     
    paidAt: number; // Timestamp of payment
}

export interface FundAvailableAttestation extends AttestationBase {
    type: AttestationType.FUNDAVAILABLE;
    currency: string; // Currency of the amount available
    amount: string; // Amount available
    expiryDate: number; // Timestamp, expiry date of the fund availability
}

export type Attestation =
    IdentityAttestation |
    EmailAddressAttestation |
    AddressAttestation |
    AgeAttestation |
    MobileNumberAttestation |
    CashPaidAttestation |
    FundAvailableAttestation;

export interface AttestationVerificationResult {
    attestation: Attestation;
    isValid: boolean;
    error?: string;
}

export interface AttestationCipherData {
    cipherText: string; // Encrypted attestation data
    issuerNodeId: string; // NodeId of the attestation issuer
    issuerPublicKey: string; // Public key of the issuer    
    auth_tag: string; // Authentication tag for the encrypted data
}
