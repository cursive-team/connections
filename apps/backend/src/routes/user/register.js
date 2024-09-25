"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("@/lib/prisma/client"));
const token_1 = require("@/lib/auth/token");
const _types_1 = require("@types");
const router = express_1.default.Router();
/**
 * @route POST /api/user/register
 * @desc Registers a new user with the provided email, public keys, and password information.
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = _types_1.UserRegisterRequestSchema.parse(req.body);
        const { email, signaturePublicKey, encryptionPublicKey, passwordSalt, passwordHash, authenticationTag, iv, encryptedData, backupEntryType, clientCreatedAt, } = validatedData;
        // Check if the user already exists by email
        const existingUser = yield client_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "User with this email already exists" });
        }
        const newUser = yield client_1.default.user.create({
            data: {
                email,
                signaturePublicKey,
                encryptionPublicKey,
                passwordSalt,
                passwordHash,
            },
        });
        const backup = yield client_1.default.backup.create({
            data: {
                user: { connect: { id: newUser.id } },
                authenticationTag,
                iv,
                encryptedData,
                backupEntryType,
                clientCreatedAt,
            },
        });
        const returnedBackupData = [
            {
                authenticationTag: backup.authenticationTag,
                iv: backup.iv,
                encryptedData: backup.encryptedData,
                backupEntryType: backup.backupEntryType,
                clientCreatedAt: backup.clientCreatedAt,
                submittedAt: backup.submittedAt,
            },
        ];
        // Generate a new auth token for the user
        const authToken = yield (0, token_1.generateAuthToken)(newUser.id);
        return res.status(201).json({
            registrationNumber: newUser.registrationNumber,
            authToken,
            backupData: returnedBackupData,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: (0, _types_1.errorToString)(error),
        });
    }
}));
exports.default = router;
