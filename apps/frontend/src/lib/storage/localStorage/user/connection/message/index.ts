import {
  CreateBackupData, errorToString,
  MessageData,
  MessageType,
} from "@types";
import {
  decryptReceivedMessage,
  parseSerializedTapBackMessage,
  parseSerializedEdgeMessage,
  TapBackMessage, EdgeMessage,
} from "@/lib/message";
import { saveBackupAndUpdateStorage } from "../../../utils";
import { getUserAndSession } from "../..";
import { Connection, User, Session } from "@/lib/storage/types";
import {
  createActivityBackup,
  createConnectionBackup,
  createEdgeBackup,
  createLastMessageFetchedAtBackup,
} from "@/lib/backup";
import { createTapBackReceivedActivity } from "@/lib/activity";
import { sha256 } from "js-sha256";
import { upsertSocialGraphEdge } from "@/lib/graph";
import { DEVCON } from "@/lib/storage/types";

function handleConnectionTapBacks(session: Session, user: User, lastMessageTimestamp: Date, connectionTapBacks: Record<string, TapBackMessage[]>): CreateBackupData[] {

  const newBackupEntries: CreateBackupData[] = [];

  Object.entries(connectionTapBacks).forEach(
    ([senderSignaturePublicKey, tapBackMessages]) => {
      if (tapBackMessages.length === 0) {
        return;
      }

      const connectionUsername = tapBackMessages[0].user.username;
      let updatedConnection: Connection = user.connections[connectionUsername];

      // Create new connection if it doesn't exist
      if (!updatedConnection) {
        const firstTapBackMessage = tapBackMessages[0];
        const newConnection: Connection = {
          user: firstTapBackMessage.user,
          taps: [],
          sentMessages: [],
        };
        updatedConnection = newConnection;
      }

      // Update connection with new tap back messages
      for (const tapBackMessage of tapBackMessages) {
        // Check claimed signature public key
        if (
          senderSignaturePublicKey !== tapBackMessage.user.signaturePublicKey
        ) {
          throw new Error("Signature public key does not match");
        }

        // Do not allow a connection to change username or keys
        if (
          updatedConnection.user.username !== tapBackMessage.user.username ||
          updatedConnection.user.signaturePublicKey !==
          tapBackMessage.user.signaturePublicKey ||
          updatedConnection.user.encryptionPublicKey !==
          tapBackMessage.user.encryptionPublicKey
        ) {
          throw new Error("Connection cannot change username or keys");
        }

        updatedConnection = {
          ...updatedConnection,
          user: {
            ...updatedConnection.user,
            ...tapBackMessage.user,
          },
          taps: [...updatedConnection.taps, tapBackMessage.tap],
        };

        const tapBackReceivedActivity = createTapBackReceivedActivity(
          updatedConnection.user.username,
          lastMessageTimestamp
        );
        const tapBackReceivedActivityBackup = createActivityBackup({
          email: user.email,
          password: session.backupMasterPassword,
          activity: tapBackReceivedActivity,
        });
        newBackupEntries.push(tapBackReceivedActivityBackup);
      }

      // Only create one backup entry per sender
      const connectionBackup = createConnectionBackup({
        email: user.email,
        password: session.backupMasterPassword,
        connection: updatedConnection,
      });
      newBackupEntries.push(connectionBackup);
    }
  );

  return newBackupEntries;
}

async function handleEdges(session: Session, user: User, messages: EdgeMessage[]): Promise<CreateBackupData[]> {
  let tapReceiverHash: string | null = null;
  if (user && user.tapGraphEnabled) {
    // Double hash the signature private key, use as identifier, use single hash version as revocation code
    tapReceiverHash = sha256(sha256(user.signaturePrivateKey).concat(DEVCON));
  }

  const newBackupEntries: CreateBackupData[] = [];

  for (const message of messages) {

    const sendHash: boolean = user.tapGraphEnabled === true;

    // Make backup, add edge to user object
    const backup: CreateBackupData = createEdgeBackup({
      email: user.email,
      password: session.backupMasterPassword,

      // Arguments for backup
      edgeId: message.edge.edgeId,
      connectionUsername: message.edge.connectionUsername, // The user that tapped / sent the message
      sentHash: sendHash, // whether *you* sent the hash or not
      isTapSender: false,
      timestamp: message.edge.timestamp
    });

    // Push onto array
    newBackupEntries.push(backup);

    // If setting is not enabled, no need to push hash to row
    if (!sendHash) {
      continue;
    }

    try {
      // Upsert row, returns edge ID
      await upsertSocialGraphEdge(session.authTokenValue, message.edge.edgeId, null, tapReceiverHash);
    } catch (error) {
      // Never fail on upsert, not worth it
      console.error(`Error while upserting edge: ${errorToString(error)}`);
      return newBackupEntries;
    }
  }

  return newBackupEntries;
}


export const processNewMessages = async (
  messages: MessageData[]
): Promise<void> => {
  if (messages.length === 0) {
    return;
  }

  const { user, session } = await getUserAndSession();

  const connectionTapBacks: Record<string, TapBackMessage[]> = {};
  const edgeMessages: EdgeMessage[] = [];

  let lastMessageTimestamp: Date | null = null;
  const sortedMessages = messages.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  for (const message of sortedMessages) {
    // Ensure messages are in order and update lastMessageTimestamp
    if (lastMessageTimestamp && message.createdAt < lastMessageTimestamp) {
      console.error("Messages are not in order");
      continue;
    }
    lastMessageTimestamp = message.createdAt;

    try {
      const { serializedData, senderSignaturePublicKey } = await decryptReceivedMessage({
          messageData: message,
          encryptionPrivateKey: user.encryptionPrivateKey,
        })

      if (serializedData.match(MessageType.TAP_BACK.toString())) {
        const tapBackMessage = parseSerializedTapBackMessage(serializedData);
        if (Object.keys(connectionTapBacks).includes(senderSignaturePublicKey)) {
          connectionTapBacks[senderSignaturePublicKey] = [
            ...connectionTapBacks[senderSignaturePublicKey],
            tapBackMessage,
          ];
        } else {
          connectionTapBacks[senderSignaturePublicKey] = [tapBackMessage];
        }
        continue;
      } else if (serializedData.match(MessageType.TAP_GRAPH_EDGE.toString())) {
        const edgeMessage = parseSerializedEdgeMessage(serializedData);
        edgeMessages.push(edgeMessage);
        continue;
      } else {
        console.error(`Message type not recognized.`);
        continue;
      }

    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  // This should never happen
  if (!lastMessageTimestamp) {
    throw new Error("No messages found");
  }

  let newBackupEntries: CreateBackupData[] = [];

  // Handle all tap backs
  const newTapBackBackups: CreateBackupData[] = handleConnectionTapBacks(session, user, lastMessageTimestamp, connectionTapBacks);

  newBackupEntries = newBackupEntries.concat(newTapBackBackups);

  // Handle all edge messages
  const edgeBackups: CreateBackupData[] = await handleEdges(session, user, edgeMessages);

  newBackupEntries = newBackupEntries.concat(edgeBackups);

  // Update last message fetched at
  const lastMessageFetchedAtBackup = createLastMessageFetchedAtBackup({
    email: user.email,
    password: session.backupMasterPassword,
    lastMessageFetchedAt: lastMessageTimestamp,
  });

  newBackupEntries.push(lastMessageFetchedAtBackup);

  // This will apply the change to user state
  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: newBackupEntries,
  });
};
