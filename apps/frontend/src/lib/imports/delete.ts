import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { OAUTH_APP_DETAILS } from "@/config";
import { DataImportSource, DataImportSourceSchema } from "@types";

/**
 * Logs out the user by deleting all storage data.
 * @returns A promise that resolves when the logout process is complete.
 */
export async function deleteImports(): Promise<void> {
  try {
    for (const source of Object.keys(OAUTH_APP_DETAILS)) {
      const app = DataImportSourceSchema.parse(source);

      // methods will handle both data deletion and backup creation
      await storage.deleteAppImports(app);
      await storage.deleteOAuthAccessToken(app);
    }

    return;
  } catch (error) {
    console.error("Error during logout:", error);
  }
}