import {z} from "zod";

export const AccessTokenSchema = z.object({
  access_token: z.string(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;