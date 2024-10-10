import { storage } from "@/lib/storage";
import { supabase } from "@/lib/realtime";

/**
 * Logs out the user by deleting all storage data.
 * @returns A promise that resolves when the logout process is complete.
 */
export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
    await storage.deleteStorageData();

    return;
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
