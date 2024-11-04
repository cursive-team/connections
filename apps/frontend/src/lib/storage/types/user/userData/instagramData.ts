import {z} from "zod";
import {nullToUndefined} from "@types";

export const InstagramDataSchema = z.object({
  username: nullToUndefined(z.string()),
});

export type InstagramData = z.infer<typeof InstagramDataSchema>;