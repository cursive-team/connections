import { storage } from "@/lib/storage";
import { Connection, FlattenedUserData } from "@/lib/storage/types";
import { toast } from "sonner";

// NOTE: the CSV delimiter is a semicolon. If a user-inputted value has a semicolon it's swapped out with a comma to
// prevent the exported CSV from being corrupted
function sanitizeCSVExport(data: string | undefined): string {
  if (!data) {
    return "";
  }
  data = data.replaceAll(";", ",");
  return data.replaceAll("\n", " ");
}

function flattenAndEscapeUserData(user: Connection): FlattenedUserData {
  const userData = user.user;
  const comment = user.comment;
  return {
    username: sanitizeCSVExport(userData.username),
    displayName: sanitizeCSVExport(userData.displayName),
    signaturePublicKey: userData.signaturePublicKey,
    encryptionPublicKey: userData.encryptionPublicKey,
    twitterHandle: sanitizeCSVExport(userData.twitter?.username),
    signalHandle: sanitizeCSVExport(userData.signal?.username),
    instagramHandle: sanitizeCSVExport(userData.instagram?.username),
    farcasterHandle: sanitizeCSVExport(userData.farcaster?.username),
    bio: sanitizeCSVExport(userData.bio),
    pronouns: sanitizeCSVExport(userData.pronouns),
    note: sanitizeCSVExport(comment?.note),
    emoji: sanitizeCSVExport(comment?.emoji),
  };
}

function exportToCSV(connections: FlattenedUserData[]): Blob {
  const delimiter = ";";
  const keys = Object.keys(connections[0]);
  const csvContent =
    keys.join(delimiter) +
    "\n" +
    connections
      .map((connection) => {
        return keys
          .map((key) => {
            const keyTyped = key as keyof typeof connection;
            const cell =
              connection[keyTyped] === undefined ? "" : connection[keyTyped];
            return cell;
          })
          .join(delimiter);
      })
      .join("\n");

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

function convertConnectionsToCSVBlob(
  connections: Record<string, Connection>
): Blob | null {
  // flatten connection rows
  const connectionRows: FlattenedUserData[] = [];
  const usernames = Object.keys(connections);
  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const connectionData = connections[username];
    if (connectionData) {
      connectionRows.push(flattenAndEscapeUserData(connectionData));
    }
  }

  if (connectionRows.length > 0) {
    return exportToCSV(connectionRows);
  }
  return null;
}

/**
 * Exports connection UserData to CSV file.
 */
export async function exportConnectionsToCSV(): Promise<void> {
  try {
    const user = await storage.getUser();
    if (user && user.connections) {
      // Create a Blob with the CSV data and type
      const blob = convertConnectionsToCSVBlob(user.connections);
      if (!blob) {
        toast.error("No connections to export");
        return;
      }

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor tag for downloading
      const a = document.createElement("a");

      // Set the URL and download attribute of the anchor tag
      a.href = url;
      a.download = "cursive_connections.csv";

      // Trigger the download by clicking the anchor tag
      a.click();
    }

    return;
  } catch (error) {
    console.error("Error exporting user connections to CSV:", error);
  }
}
