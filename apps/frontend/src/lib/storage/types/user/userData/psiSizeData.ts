import { z } from "zod";

export const ConnectionPSISizeSchema = z.record(z.string(), z.number());

export type ConnectionPSISize = z.infer<typeof ConnectionPSISizeSchema>;

export const PullPSISchema = z.record(z.string(), z.boolean());

export type PullPSI = z.infer<typeof PullPSISchema>;