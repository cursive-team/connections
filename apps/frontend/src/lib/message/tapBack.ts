import { z } from "zod";
import { randomBytes } from "crypto";
import { getCounterMessage, sign } from "../crypto/babyJubJub";
import {
  ChipIssuer,
  MessageTypeSchema,
  MessageType
} from "@types";
import {
  TapDataSchema,
  UserDataSchema,
  UserData,
} from "../storage/types";

export const TapBackMessageSchema = z.object({
  type: MessageTypeSchema,
  user: UserDataSchema,
  tap: TapDataSchema,
});

export type TapBackMessage = z.infer<typeof TapBackMessageSchema>;

export interface GenerateTapBackMessageArgs {
  user: UserData;
  chipPrivateKey: string;
  chipPublicKey: string;
  chipIssuer: ChipIssuer;
}

export const generateSerializedTapBackMessage = async ({
  user,
  chipPrivateKey,
  chipPublicKey,
  chipIssuer,
}: GenerateTapBackMessageArgs): Promise<{
  serializedMessage: string;
  messageTimestamp: Date;
}> => {
  const msgNonce = 0; // No counter for tap backs (4 bytes)
  const generatedRandomBytes = randomBytes(28); // 28 random bytes
  const message = getCounterMessage(
    msgNonce,
    generatedRandomBytes.toString("hex")
  );
  const signature = sign(chipPrivateKey, message);

  // Return message timestamp to synchronize sent and received timestamps
  const messageTimestamp = new Date();

  return {
    serializedMessage: JSON.stringify(
      TapBackMessageSchema.parse({
        type: MessageType.TAP_BACK,
        user,
        tap: {
          message,
          signature,
          chipPublicKey,
          chipIssuer,
          timestamp: messageTimestamp,
        },
      })
    ),
    messageTimestamp,
  };
};

export const parseSerializedTapBackMessage = (
  message: string
): TapBackMessage => {
  return TapBackMessageSchema.parse(JSON.parse(message));
};
