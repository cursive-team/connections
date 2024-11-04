import {z} from "zod";

export enum WebSocketRequestTypes {
  CONNECT = "CONNECT",
  MSG = "MESSAGE",
  CLOSE = "CLOSE",
}

export enum WebSocketResponseTypes {
  SUCCESS_CONNECT = "CONNECT_SUCCESS",
  MSG = "MESSAGE",
  ERROR = "ERROR"
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
  let respType: WebSocketResponseTypes | null = null;

  console.log("Type: ", req.type)
  switch (req.type) {
    case WebSocketRequestTypes.CONNECT:
      respType = WebSocketResponseTypes.SUCCESS_CONNECT;
      break;
    case WebSocketRequestTypes.MSG:
      respType = WebSocketResponseTypes.MSG;
      break;
    default:
      throw new Error("Invalid websocket request type");
  }

  if (!respType) {
    throw new Error("Websocket response type should not be null.")
  }

  return {
    type: respType.toString(),
    targetSigPubKey: req.targetSigPubKey,
    senderSigPubKey: req.senderSigPubKey,
    payload: req.payload,
  }
}