import { z } from "zod";

export const LiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export type Literal = z.infer<typeof LiteralSchema>;

export type Json = Literal | { [key: string]: Json } | Json[];

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([LiteralSchema, z.array(JsonSchema), z.record(JsonSchema)])
);
