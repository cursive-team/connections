import {z} from "zod";

export enum WebSocketRequestTypes {
  CONNECT = "connect",
  CLOSE = "close",
  MSG = "message",
}

export enum WebSocketResponseTypes {
  // CONNECT = "connect", // NOTE: we may need a server response to confirm connection / client info has been successfully received
  MSG = "message",
  ERROR = "error"
}

export const WebSocketErrorPayloadSchema = z.object({
  error: z.string(),
});

export type WebSocketErrorPayload = z.infer<
  typeof WebSocketErrorPayloadSchema
>;

export const WebSocketRequestSchema = z.object({
  authToken: z.string(),
  type: z.string(),
  targetSigPubKey: z.coerce.string(),
  senderSigPubKey: z.coerce.string(),
  payload: z.any(),
});

export type WebSocketRequest = z.infer<
  typeof WebSocketRequestSchema
>;

export const WebSocketResponseSchema = z.object({
  type: z.string(),
  targetSigPubKey: z.string(),
  senderSigPubKey: z.string(),
  payload: z.any(),
});

export type WebSocketResponse = z.infer<
  typeof WebSocketResponseSchema
>;

export const MapRequestToResponse = (req: WebSocketRequest): WebSocketResponse => {
  return {
    type: req.type,
    targetSigPubKey: req.targetSigPubKey,
    senderSigPubKey: req.senderSigPubKey,
    payload: req.payload,
  }
}