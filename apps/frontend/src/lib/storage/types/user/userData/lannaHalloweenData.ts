import { z } from "zod";
import { HashableFieldSchema } from "@types";

export const LannaHalloweenDataSchema = z.object({
  favoriteCharacter: HashableFieldSchema,
  interests: z.object({
    movies: HashableFieldSchema,
    music: HashableFieldSchema,
    books: HashableFieldSchema,
  }),
});

export type LannaHalloweenData = z.infer<typeof LannaHalloweenDataSchema>;
