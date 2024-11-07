import { z } from "zod";
import {
  ChipIssuerSchema,
  DataImportSource,
  DataImportSourceSchema,
  ImportDataTypeSchema
} from "@types";

export const AppImportSchema = z.object({
  lastImportedAt: z.coerce.date(),
  saveToLocalStorage: z.boolean(),
  serializedData: z.string(),
});

export type AppImport = z.infer<typeof AppImportSchema>;

export const AppImportsSchema = z.record(ImportDataTypeSchema, AppImportSchema);

export type AppImports = z.infer<typeof AppImportsSchema>;

export const ChipIssuerImportsSchema = z.record(ChipIssuerSchema, AppImportsSchema);

export type ChipIssuerImports = z.infer<typeof ChipIssuerImportsSchema>;

export const ConsentSchema = z.object({
  consentToShare: z.boolean(),
});

export type Consent = z.infer<typeof ConsentSchema>;

export const AppConsentsSchema = z.record(DataImportSourceSchema, ConsentSchema);

export type AppConsents = z.infer<typeof AppConsentsSchema>;

export const ChipIssuerAppConsentSchema = z.record(ChipIssuerSchema, AppConsentsSchema);

export type ChipIssuerAppConsent = z.infer<typeof ChipIssuerAppConsentSchema>;