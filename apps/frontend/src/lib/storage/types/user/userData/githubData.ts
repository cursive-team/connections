import { z } from "zod";
import {
  nullToUndefined,
  UpdatableFieldSchema,
  UpdatableRecordStringToStringArraySchema,
  UpdatableStringArraySchema
} from "@types";

export const GithubDataSchema = z.object({
  weekOct20Commits: nullToUndefined(UpdatableFieldSchema),
  lannaCommits: nullToUndefined(UpdatableFieldSchema),
  annualCommits: nullToUndefined(UpdatableFieldSchema),
  starredRepos: nullToUndefined(UpdatableStringArraySchema),
  programmingLanguages: nullToUndefined(UpdatableRecordStringToStringArraySchema),
});

export type GithubData = z.infer<typeof GithubDataSchema>;
