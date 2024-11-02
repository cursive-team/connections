import { z } from "zod";
import { nullToUndefined } from "@types";
import { EventSchema } from "@/lib/imports/integrations/sociallayer";

export const SocialLayerDataSchema = z.object({
  memberships: nullToUndefined(z.array(z.string())),
  events: nullToUndefined(z.array(EventSchema)),
  attendance: nullToUndefined(z.record(z.string(), z.boolean())),
});

export type SocialLayerData = z.infer<typeof SocialLayerDataSchema>;