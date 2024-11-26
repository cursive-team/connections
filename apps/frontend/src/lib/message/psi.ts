import { z } from "zod";
import {
  MessageTypeSchema,
  MessageType
} from "@types";

export const PSIMessageSchema = z.object({
  type: MessageTypeSchema,
  senderUsername: z.string(),
});

export type PSIMessage = z.infer<typeof PSIMessageSchema>;

export interface GeneratePSIMessageArgs {
  senderUsername: string,
}

export const generateSerializedPSIMessage = async ({ senderUsername }: GeneratePSIMessageArgs): Promise<{
  serializedMessage: string;
  messageTimestamp: Date;
}> => {
  // Return message timestamp to synchronize sent and received timestamps
  const messageTimestamp = new Date();

  return {
    serializedMessage: JSON.stringify(
      PSIMessageSchema.parse({
        type: MessageType.PSI,
         senderUsername,
      })
    ),
    messageTimestamp,
  };
};

export const parseSerializedPSIMessage = (
  message: string
): PSIMessage => {
  return PSIMessageSchema.parse(JSON.parse(message));
};


