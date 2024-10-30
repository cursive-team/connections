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

// Metadata about a hashed field
export const HashDataSchema = z.object({
  hashPrefix: z.string(),
  enclavePublicKeyHash: z.string(),
  lastUpdated: z.coerce.date(),
});

export type HashData = z.infer<typeof HashDataSchema>;

// Represents a string field that can be privately hashed
export const HashableFieldSchema = z.object({
  value: z.string(),
  hashData: nullToUndefined(HashDataSchema),
});

export type HashableField = z.infer<typeof HashableFieldSchema>;
