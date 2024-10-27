import { z } from "zod";
import { nullToUndefined, UpdatableFieldSchema } from "@types";

export const GithubDataSchema = z.object({
  weekOct20Commits: nullToUndefined(UpdatableFieldSchema),
  lannaCommits: nullToUndefined(UpdatableFieldSchema),
});

export type GithubData = z.infer<typeof GithubDataSchema>;
