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

export * from "./chip";
export * from "./user";
export * from "./oauth";
export * from "./util";
