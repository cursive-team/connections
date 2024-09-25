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
exports.verifyAuthToken = exports.generateAuthToken = void 0;
const uuid_1 = require("uuid");
const client_1 = __importDefault(require("@/lib/prisma/client"));
/**
 * Generates an auth token and stores it in the database for a given userId.
 * @param userId The user ID for which to generate and store the auth token.
 * @returns The generated auth token.
 */
const generateAuthToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenValue = (0, uuid_1.v4)();
    // Set default auth token expiry time to 2 weeks from now
    // 14 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
    const twoWeeksFromNow = new Date(Date.now() + twoWeeksInMilliseconds);
    const user = yield client_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error(`Could not generate auth token for user ${userId}`);
    }
    yield client_1.default.authToken.create({
        data: {
            value: tokenValue,
            userId,
            expiresAt: twoWeeksFromNow,
        },
    });
    return { value: tokenValue, expiresAt: twoWeeksFromNow };
});
exports.generateAuthToken = generateAuthToken;
/**
 * Verifies that an auth token is valid, and returns the user ID associated with it.
 * @param token - The auth token to verify.
 * @returns The user ID associated with the auth token, or undefined if the token is invalid.
 */
const verifyAuthToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenEntry = yield client_1.default.authToken.findUnique({
        where: { value: token },
    });
    if (!tokenEntry) {
        return undefined;
    }
    if (tokenEntry.expiresAt < new Date()) {
        return undefined;
    }
    if (tokenEntry.revokedAt !== null && tokenEntry.revokedAt < new Date()) {
        return undefined;
    }
    return tokenEntry.userId;
});
exports.verifyAuthToken = verifyAuthToken;
