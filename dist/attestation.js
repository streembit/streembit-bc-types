"use strict";
// Attestation types
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdType = exports.AttestationType = void 0;
var AttestationType;
(function (AttestationType) {
    AttestationType["IDENTITY"] = "identity";
    AttestationType["EMAIL"] = "email";
    AttestationType["MOBILE"] = "mobile";
    AttestationType["ADDRESS"] = "address";
    AttestationType["AGE"] = "age";
    AttestationType["CASHPAID"] = "cashpaid";
    AttestationType["FUNDAVAILABLE"] = "fundavailable";
    AttestationType["AML"] = "aml";
    AttestationType["KYC"] = "kyc"; // Know Your Customer
})(AttestationType || (exports.AttestationType = AttestationType = {}));
var IdType;
(function (IdType) {
    IdType["PASSPORT"] = "passport";
    IdType["DRIVINGLICENSE"] = "drivinglicense";
    IdType["IDCARD"] = "identitycard";
})(IdType || (exports.IdType = IdType = {}));
