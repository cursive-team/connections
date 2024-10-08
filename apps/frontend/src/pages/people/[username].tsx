import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Connection } from "@/lib/storage/types";
import { toast } from "sonner";
import { TapParams, ChipTapResponse } from "@types";

interface TapChipModalProps {
  tapResponse: ChipTapResponse;
  onClose: () => void;
  onSubmit: (emoji: string | null, note: string) => void;
}

const TapChipModal: React.FC<TapChipModalProps> = ({
  tapResponse,
  onClose,
  onSubmit,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [privateNote, setPrivateNote] = useState("");

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">You tapped a chip!</h3>
        <p>Chip Issuer: {tapResponse.chipIssuer}</p>
        <p>Chip Public Key: {tapResponse.tap?.chipPublicKey}</p>
        <p>Message: {tapResponse.tap?.message}</p>
        <p>Signature: {tapResponse.tap?.signature}</p>
        <p>Tap Count: {tapResponse.tap?.tapCount}</p>
        <p>Owner Display Name: {tapResponse.tap?.ownerDisplayName}</p>
        <p>Owner Bio: {tapResponse.tap?.ownerBio}</p>
        <p>
          Owner Signature Public Key: {tapResponse.tap?.ownerSignaturePublicKey}
        </p>
        <p>
          Owner Encryption Public Key:{" "}
          {tapResponse.tap?.ownerEncryptionPublicKey}
        </p>
        {typeof tapResponse.tap?.ownerUserData === "object" &&
          tapResponse.tap?.ownerUserData !== null &&
          "twitter" in tapResponse.tap.ownerUserData &&
          typeof tapResponse.tap.ownerUserData.twitter === "object" &&
          tapResponse.tap.ownerUserData.twitter !== null &&
          "username" in tapResponse.tap.ownerUserData.twitter &&
          typeof tapResponse.tap.ownerUserData.twitter.username === "string" &&
          tapResponse.tap.ownerUserData.twitter.username !== "" && (
            <p>Twitter: @{tapResponse.tap.ownerUserData.twitter.username}</p>
          )}
        {typeof tapResponse.tap?.ownerUserData === "object" &&
          tapResponse.tap?.ownerUserData !== null &&
          "telegram" in tapResponse.tap.ownerUserData &&
          typeof tapResponse.tap.ownerUserData.telegram === "object" &&
          tapResponse.tap.ownerUserData.telegram !== null &&
          "username" in tapResponse.tap.ownerUserData.telegram &&
          typeof tapResponse.tap.ownerUserData.telegram.username === "string" &&
          tapResponse.tap.ownerUserData.telegram.username !== "" && (
            <p>Telegram: @{tapResponse.tap.ownerUserData.telegram.username}</p>
          )}
        <p>Timestamp: {tapResponse.tap?.timestamp.toISOString()}</p>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Add a reaction:</h4>
          <div className="flex space-x-2">
            {["😊", "😢", "❤️"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className={`p-2 rounded ${
                  selectedEmoji === emoji
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Add a private note:</h4>
          <textarea
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            rows={3}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Close
          </button>
          <button
            onClick={() => onSubmit(selectedEmoji, privateNote)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tapInfo, setTapInfo] = useState<{
    tapParams: TapParams;
    tapResponse: ChipTapResponse;
  } | null>(null);
  const [showTapModal, setShowTapModal] = useState(false);

  useEffect(() => {
    const fetchConnectionAndTapInfo = async () => {
      if (typeof username === "string") {
        const user = await storage.getUser();
        if (!user || !user.connections[username]) {
          console.error("User not found");
          toast.error("User not found");
          router.push("/people");
          return;
        }

        setConnection(user.connections[username]);
        const savedTapInfo = await storage.loadSavedTapInfo();
        // Delete saved tap info after fetching
        await storage.deleteSavedTapInfo();
        // Show tap modal if tap info is for current connection
        if (
          savedTapInfo &&
          savedTapInfo.tapResponse.tap?.ownerUsername === username
        ) {
          setTapInfo(savedTapInfo);
          setShowTapModal(true);
        }
      }
    };

    fetchConnectionAndTapInfo();
  }, [username, router]);

  const handleCloseTapModal = async () => {
    setShowTapModal(false);
    await storage.deleteSavedTapInfo();
  };

  const handleSubmitComment = async (emoji: string | null, note: string) => {
    if (!connection) return;

    try {
      await storage.updateComment(connection.user.username, {
        emoji: emoji || undefined,
        note: note === "" ? undefined : note,
      });
      const user = await storage.getUser();
      if (!user || !user.connections[connection.user.username]) {
        throw new Error("User not found");
      }

      setConnection(user.connections[connection.user.username]);
      handleCloseTapModal();
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  if (!connection) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showTapModal && tapInfo && (
        <TapChipModal
          tapResponse={tapInfo.tapResponse}
          onClose={handleCloseTapModal}
          onSubmit={handleSubmitComment}
        />
      )}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {connection.user.displayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              @{connection.user.username}
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {connection.user.bio}
        </p>
        <div className="space-y-2">
          {connection.user.twitter && (
            <p className="text-blue-500">
              Twitter: @{connection.user.twitter.username}
            </p>
          )}
          {connection.user.telegram && (
            <p className="text-blue-500">
              Telegram: @{connection.user.telegram.username}
            </p>
          )}
        </div>
        {connection.comment && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Your Note:</h2>
            <p>{connection.comment.note}</p>
            {connection.comment.emoji && (
              <p className="text-2xl mt-2">{connection.comment.emoji}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
