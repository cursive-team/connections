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

// Helper function to create a schema that converts null to undefined
export const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  schema
    .nullable()
    .transform((val) => (val === null ? undefined : val))
    .optional();

// Represents a numerical field that has an update date
export const UpdatableFieldSchema = z.object({
  value: z.number(),
  lastUpdated: z.coerce.date(),
});

export type UpdatableField = z.infer<typeof UpdatableFieldSchema>;
