import { storage } from "@/lib/storage";
import { Connection, FlattenedUserData, UserData } from "@/lib/storage/types";
import { toast } from "sonner";

function flattenUserData(userData: UserData): FlattenedUserData {
  return {
    username: userData.username,
    displayName: userData.displayName,
    bio: userData.bio,
    signaturePublicKey: userData.signaturePublicKey,
    encryptionPublicKey: userData.encryptionPublicKey,
    twitterHandle: userData.twitter?.username,
    signalHandle: userData.signal?.username,
    instagramHandle: userData.instagram?.username,
    farcasterHandle: userData.farcaster?.username,
    pronouns: userData.pronouns,
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
      connectionRows.push(flattenUserData(connectionData.user));
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
