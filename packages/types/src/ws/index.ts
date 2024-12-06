import {z} from "zod";

export enum SocketRequestType {
  PULL_TAP_BACK_MSG = "PULL_TAP_BACK_MSG",
  PULL_PSI_MSG = "PULL_PSI_MSG",
  EXPUNGE = "EXPUNGE",
}

export const SocketRequestTypeSchema = z.nativeEnum(SocketRequestType);

export enum SocketResponseType {
  PULL_TAP_BACK_MSG = "PULL_TAP_BACK_MSG",
  PULL_PSI_MSG = "PULL_PSI_MSG",
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