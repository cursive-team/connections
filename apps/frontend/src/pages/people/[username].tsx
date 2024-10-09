"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Connection } from "@/lib/storage/types";
import { toast } from "sonner";
import { TapParams, ChipTapResponse } from "@types";
import { AppButton } from "@/components/ui/Button";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import { AppTextarea } from "@/components/ui/Textarea";

interface TapChipModalProps {
  tapResponse: ChipTapResponse;
  onClose: () => void;
  onSubmit: (emoji: string | null, note: string) => void;
}

const TapChipModal: React.FC<TapChipModalProps> = ({
  tapResponse,
  // onClose,
  onSubmit,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [privateNote, setPrivateNote] = useState("");

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-6 rounded-[50px] w-full max-w-[90vw] h-[80vh] overflow-y-auto">
        <div className="size-[80px] relative flex mx-auto">
          <div className="absolute -left-3 size-8 rounded-full bg-[#9DE8FF] z-0 top-[28px] border border-quaternary/10"></div>
          <Image
            width={80}
            height={80}
            alt="connection artwork"
            src="/images/connection-artwork.svg"
            className="relative z-[1]"
          />
          <div className=" absolute size-8 rounded-full bg-[#FFFF9D] -right-3 top-[28px] z-0 border border-quaternary/10"></div>
        </div>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col text-center">
            <span className="text-[20px] font-semibold text-primary tracking-[-0.1px] font-sans">
              {tapResponse.tap?.ownerUsername}
            </span>
            <span className=" text-secondary text-sm font-medium font-sans text-center">
              {tapResponse.tap?.ownerDisplayName}
            </span>
          </div>
          <span className="text-center text-xs text-tertiary font-medium font-sans">
            Add details to remember this connection. <br />
            They stay <strong className="font-bold">private to you.</strong>
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Labels
          </span>
          <div className="flex space-x-2 justify-around">
            {["💼", "🪩", "😊", "🎃", "🙈"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className={`p-2 size-12 rounded-full bg-[#F1F1F1] border border-transparent duration-200 ${
                  selectedEmoji === emoji ? "!border-primary" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Notes
          </span>
          <AppTextarea
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            rows={3}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <AppButton onClick={() => onSubmit(selectedEmoji, privateNote)}>
            Save
          </AppButton>
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

  const showSocials =
    connection?.user?.twitter?.username && connection?.user?.telegram?.username;

  return (
    <>
      {showTapModal && tapInfo && (
        <TapChipModal
          tapResponse={tapInfo.tapResponse}
          onClose={handleCloseTapModal}
          onSubmit={handleSubmitComment}
        />
      )}
      <AppLayout
        withContainer={false}
        back={{
          label: "Back",
          href: "/people",
        }}
        header={
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col pt-4">
                <span className=" text-[30px] font-semibold tracking-[-0.22px] font-sans">{`@${connection?.user?.username}`}</span>
                <span className="text-sm font-medium font-sans text-tertiary">
                  {connection?.user?.displayName}
                </span>
              </div>
              <div className="size-10 bg-button-secondary rounded-full border border-quaternary/10"></div>
            </div>
          </div>
        }
      >
        <div className="divide-y divide-y-primary pt-10">
          {showSocials && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <span className="text-sm font-semibold text-primary font-sans">
                Socials
              </span>
              <div className="flex flex-col gap-4">
                {connection?.user?.telegram?.username && (
                  <LinkCardBox
                    label="Telegram"
                    value={`@${connection.user.telegram.username}`}
                    href={`https://t.me/${connection.user.telegram.username}`}
                  />
                )}
                {connection?.user?.twitter?.username && (
                  <LinkCardBox
                    label="X"
                    value={`@${connection.user.twitter.username}`}
                    href={`https://twitter.com/${connection.user.twitter.username}`}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 py-4 px-4">
            <span className="text-sm font-semibold text-primary font-sans">
              Bio
            </span>
            <span className="text-sm text-secondary font-sans font-normal">
              {connection?.user?.bio}
            </span>
          </div>

          <div className="flex flex-col gap-2 py-4 px-4">
            <span className="text-sm font-semibold text-primary font-sans">
              Your Note
            </span>
            <span className="text-sm text-secondary font-sans font-normal">
              {connection?.comment?.note}
            </span>
            {connection?.comment?.emoji && (
              <p className="text-2xl mt-2">{connection?.comment?.emoji}</p>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default UserProfilePage;
