import { z } from "zod";
import { ChipIssuerSchema } from "../chip";

export const DataHashInputSchema = z.object({
  dataIdentifier: z.string(),
  encryptedInput: z.string(),
});

export type DataHashInput = z.infer<typeof DataHashInputSchema>;

export const CreateDataHashRequestSchema = z.object({
  authToken: z.string(),
  chipIssuer: ChipIssuerSchema.nullable(),
  locationId: z.string().nullable(),
  enclavePublicKey: z.string(),
  dataHashInputs: z.array(DataHashInputSchema),
});

export type CreateDataHashRequest = z.infer<typeof CreateDataHashRequestSchema>;
