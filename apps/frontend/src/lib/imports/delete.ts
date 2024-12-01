import { storage } from "@/lib/storage";
import { OAUTH_APP_DETAILS } from "@/config";
import { DataImportSourceSchema } from "@types";

/**
 * Deletes users data imports
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