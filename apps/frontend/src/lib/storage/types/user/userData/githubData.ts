import { z } from "zod";
import { UpdatableFieldSchema } from "@types";

export const GithubDataSchema = z.object({
  weekOct20Commits: UpdatableFieldSchema,
});

export type GithubData = z.infer<typeof GithubDataSchema>;
