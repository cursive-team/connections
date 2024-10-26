import {z} from "zod";
import {nullToUndefined} from "@types";

export const SignalDataSchema = z.object({
  username: nullToUndefined(z.string()),
});

export type SignalData = z.infer<typeof SignalDataSchema>;