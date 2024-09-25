"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterResponseSchema = exports.UserRegisterRequestSchema = exports.BackupDataSchema = exports.AuthTokenSchema = void 0;
const zod_1 = require("zod");
exports.AuthTokenSchema = zod_1.z.object({
    value: zod_1.z.string(),
    expiresAt: zod_1.z.coerce.date(),
});
exports.BackupDataSchema = zod_1.z.object({
    authenticationTag: zod_1.z.string(),
    iv: zod_1.z.string(),
    encryptedData: zod_1.z.string(),
    backupEntryType: zod_1.z.string(),
    clientCreatedAt: zod_1.z.coerce.date(),
    submittedAt: zod_1.z.coerce.date(),
});
exports.UserRegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    signaturePublicKey: zod_1.z.string(),
    encryptionPublicKey: zod_1.z.string(),
    passwordSalt: zod_1.z.string(),
    passwordHash: zod_1.z.string(),
    authenticationTag: zod_1.z.string(),
    iv: zod_1.z.string(),
    encryptedData: zod_1.z.string(),
    backupEntryType: zod_1.z.string(),
    clientCreatedAt: zod_1.z.coerce.date(),
});
exports.UserRegisterResponseSchema = zod_1.z.object({
    registrationNumber: zod_1.z.number().int(),
    authToken: exports.AuthTokenSchema,
    backupData: zod_1.z.array(exports.BackupDataSchema),
});
