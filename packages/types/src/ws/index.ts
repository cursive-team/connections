import {z} from "zod";

export enum SocketRequestType {
  TAP_BACK = "TAP_BACK",
  EXPUNGE = "EXPUNGE",
}

export const SocketRequestTypeSchema = z.nativeEnum(SocketRequestType);

export enum SocketResponseType {
  TAP_BACK = "TAP_BACK",
  ERROR = "ERROR"
}

export const SocketResponseTypeSchema = z.nativeEnum(SocketResponseType);


export const SocketErrorPayloadSchema = z.object({
  error: z.string(),
});

export type SocketErrorPayload = z.infer<
  typeof SocketErrorPayloadSchema
>;

export const SocketRequestSchema = z.object({
  type: SocketRequestTypeSchema,
  recipientSigPubKey: z.coerce.string().nullable(),
  payload: z.any(),
});

export type SocketRequest = z.infer<
  typeof SocketRequestSchema
>;

export const SocketResponseSchema = z.object({
  type: SocketResponseTypeSchema,
  recipientSigPubKey: z.string().nullable(),
  payload: z.any(),
});

export type SocketResponse = z.infer<
  typeof SocketResponseSchema
>;

export const MapRequestToResponse = (req: SocketRequest): SocketResponse => {
  let respType: SocketResponseType | null = null;

  switch (req.type) {
    case SocketRequestType.TAP_BACK:
      respType = SocketResponseType.TAP_BACK;
      break;
    default:
      throw new Error("Invalid socket request type");
  }

  if (!respType) {
    throw new Error("Socket response type should not be null.")
  }

  return {
    type: respType,
    recipientSigPubKey: req.recipientSigPubKey,
    payload: req.payload,
  }
}