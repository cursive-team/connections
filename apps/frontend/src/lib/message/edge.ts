import { z } from "zod";
import {
  MessageTypeSchema,
  MessageType
} from "@types";

import { EdgeMessageContentSchema } from "@/lib/storage/types";

export const EdgeMessageSchema = z.object({
  type: MessageTypeSchema,
  edge: EdgeMessageContentSchema,
});

export type EdgeMessage = z.infer<typeof EdgeMessageSchema>;

export interface GenerateEdgeMessageArgs {
  edgeId: string,
  senderUsername: string,
}

export const generateSerializedEdgeMessage = async ({ edgeId, senderUsername }: GenerateEdgeMessageArgs): Promise<{
  serializedMessage: string;
  messageTimestamp: Date;
}> => {
  // Return message timestamp to synchronize sent and received timestamps
  const messageTimestamp = new Date();

  return {
    serializedMessage: JSON.stringify(
      EdgeMessageSchema.parse({
        type: MessageType.TAP_GRAPH_EDGE,
        edge: {
          edgeId,
          connectionUsername: senderUsername,
          timestamp: messageTimestamp,
        }
      })
    ),
    messageTimestamp,
  };
};

export const parseSerializedEdgeMessage = (
  message: string
): EdgeMessage => {
  return EdgeMessageSchema.parse(JSON.parse(message));
};


