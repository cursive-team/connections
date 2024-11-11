import {z} from "zod";

export enum SocketRequestType {
  TAP_BACK = "TAP_BACK",
  PSI = "PSI",
  EXPUNGE = "EXPUNGE",
}

export const SocketRequestTypeSchema = z.nativeEnum(SocketRequestType);

export enum SocketResponseType {
  TAP_BACK = "TAP_BACK",
  PSI = "PSI",
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