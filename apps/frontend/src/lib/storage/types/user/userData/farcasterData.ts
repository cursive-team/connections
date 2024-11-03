import {z} from "zod";
import {nullToUndefined} from "@types";

export const FarcasterDataSchema = z.object({
  username: nullToUndefined(z.string()),
});

export type FarcasterData = z.infer<typeof FarcasterDataSchema>;