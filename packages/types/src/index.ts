import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export interface ErrorResponse {
  error: string;
}

export function errorToString(error: unknown): string {
  if (error instanceof ZodError) {
    return fromZodError(error).message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    return "An unknown error has occurred";
  }
}

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

export * from "./user";
export * from "./chip";
