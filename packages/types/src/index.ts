<<<<<<< HEAD
=======
import { z } from "zod";
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export * from "./chip";
export * from "./user";
export * from "./util";
=======
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
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
=======
export * from "./user";
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
export * from "./chip";
export * from "./user";
export * from "./util";
>>>>>>> 32df80b (fix type exporting)
