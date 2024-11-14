import { storage } from "@/lib/storage";
import { createEdgeBackfillForEnabledUserBackup, createToggleSocialGraphBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";
import { upsertSocialGraphEdge } from "@/lib/graph";
import { sha256 } from "js-sha256";
import { DEVCON } from "@/lib/storage/types";
import { errorToString } from "@types";
import { User, Session } from "@/lib/storage/types";

export const updateBackfilledEdgesOnUser = (user: User, updatedEdgeIds: string[]): User => {
  // Update local edges
  if (updatedEdgeIds && updatedEdgeIds.length > 0 && user.edges) {
    // This hurts my soul
    for (const edgeId of updatedEdgeIds) {
      for (let i = 0; i < user.edges.length; i++) {
        if (user.edges[i].edgeId === edgeId) {
          user.edges[i].sentHash = true;
        }
      }
    }
  }
  return user;
}

// This backfills without consideration of feature enablement. That consideration is within the context of the call
// site.
const backfillEdges = async (user: User, session: Session): Promise<string[]> => {
  const sentEdges: string[] = [];

  // The value is updated in the backup method, so it should be currently false and will soon be flipped to true
  if (user.edges) {
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
          // Include in backup:
          sentEdges.push(edge.edgeId);
        }
      } catch (error) {
        console.log(`Upsert edge failed, continue: ${errorToString(error)}`)
      }
    }
  }

  return sentEdges;
}

// For users that enabled the graph feature *before* the backfill there will be nothing that triggers a backfill. In
// this case we run *1 backfill* automatically
export const backfillEdgesForUserWithFeatureAlreadyEnabled = async (user: User, session: Session): Promise<void> => {
  if (user && user.tapGraphEnabled && !user.edgesBackfilledForUsersWithEnabledFeature) {
    const sentEdges = await backfillEdges(user, session);

    const backup = createEdgeBackfillForEnabledUserBackup({
      email: user.email,
      password: session.backupMasterPassword,
      sentEdges, // Will always be some kind of array now
    });

    await saveBackupAndUpdateStorage({
      user,
      session,
      newBackupData: [backup]
    });
  }

  return;
}

const backfillEdgesForTogglingGraphFeature = async (user: User, session: Session): Promise<void> => {
  let sentEdges: string[] = [];

  // Only backfill if feature is flipped from "false" -> "true"
  if (user && user.edges && !user.tapGraphEnabled) {
    sentEdges = await backfillEdges(user, session);
  }

  const backup = createToggleSocialGraphBackup({
    email: user.email,
    password: session.backupMasterPassword,
    sentEdges, // Will always be some kind of array now
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [backup]
  });

  return;
}

export const toggleGraphConsent = async (): Promise<boolean> => {
  const { user, session } = await storage.getUserAndSession();
  if (user &&
    session &&
    session.authTokenValue &&
    session.authTokenExpiresAt > new Date()
  ) {

    await backfillEdgesForTogglingGraphFeature(user, session);

    return true;
  }
  return false;
}