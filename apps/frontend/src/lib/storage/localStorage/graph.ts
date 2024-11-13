import { storage } from "@/lib/storage";
import { createToggleSocialGraphBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";
import { upsertSocialGraphEdge } from "@/lib/graph";
import { sha256 } from "js-sha256";
import { DEVCON } from "@/lib/storage/types";
import { errorToString } from "@types";

export const toggleGraphConsent = async (): Promise<boolean> => {
  const { user, session } = await storage.getUserAndSession();
  if (user &&
    session &&
    session.authTokenValue &&
    session.authTokenExpiresAt > new Date()
  ) {

    // The value is updated in the backup method, so it should be currently false and will soon be flipped to true
    if (!user.tapGraphEnabled && user.edges) {
      const sigHash = sha256(
        sha256(user.signaturePrivateKey).concat(DEVCON)
      );

      for (let i = 0; i < user.edges.length; i++) {
        const edge = user.edges[i];
        try {
          if (!edge.sentHash) {
            if (edge.isTapSender) {
              await upsertSocialGraphEdge(session.authTokenValue, edge.edgeId, sigHash, null);
            } else {
              await upsertSocialGraphEdge(session.authTokenValue, edge.edgeId, null, sigHash);
            }
            // Is it valid to directly modify the edge or should there be another backup type?
            user.edges[i].sentHash = true;
          }
        } catch (error) {
          console.log(`Upsert edge failed, continue: ${errorToString(error)}`)
        }
      }
    }

    const backup = createToggleSocialGraphBackup({
      email: user.email,
      password: session.backupMasterPassword
    });

    await saveBackupAndUpdateStorage({
      user,
      session,
      newBackupData: [backup]
    });

    return true;
  }
  return false;
}