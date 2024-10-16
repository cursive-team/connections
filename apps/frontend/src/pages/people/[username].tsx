"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Connection, Session, User } from "@/lib/storage/types";
import { toast } from "sonner";
import { TapParams, ChipTapResponse } from "@types";
import { AppButton } from "@/components/ui/Button";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import { AppTextarea } from "@/components/ui/Textarea";
import { ProfileImage } from "@/components/ui/ProfileImage";
import InteractivePSI from "@/features/psi/InteractivePSI";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-6 rounded-[32px] w-full max-w-[90vw] h-full max-h-[90vh] overflow-y-auto">
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
        <div className="flex flex-col gap-4">
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
                onClick={() => {
                  logClientEvent("user-profile-tap-chip-label-selected", {
                    label: emoji,
                  });
                  handleEmojiSelect(emoji);
                }}
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
        const session = await storage.getSession();
        if (!user || !session || !user.connections[username]) {
          console.error("User not found");
          toast.error("User not found");
          router.push("/people");
          return;
        }

        setUser(user);
        setSession(session);
        setConnection(user.connections[username]);
        const savedTapInfo = await storage.loadSavedTapInfo();
        // Delete saved tap info after fetching
        await storage.deleteSavedTapInfo();
        // Show tap modal if tap info is for current connection
        if (
          savedTapInfo &&
          savedTapInfo.tapResponse.tap?.ownerUsername === username
        ) {
          logClientEvent("user-profile-tap-chip-modal-shown", {});
          setTapInfo(savedTapInfo);
          setShowTapModal(true);
        }
      }
    };

    fetchConnectionAndTapInfo();
  }, [username, router]);

  const handleCloseTapModal = async () => {
    logClientEvent("user-profile-tap-chip-modal-closed", {});
    setShowTapModal(false);
    await storage.deleteSavedTapInfo();
  };

  const handleSubmitComment = async (emoji: string | null, note: string) => {
    logClientEvent("user-profile-tap-chip-save-clicked", {
      label: emoji,
      privateNoteSet: note !== "",
    });
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

  if (!connection || !user || !session) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

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
        showFooter={false}
        back={{
          label: "Back",
          href: "/people",
        }}
        headerDivider
        header={
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full pb-4">
              <div className="flex flex-col gap-1 pt-4">
                <span className=" text-[30px] font-semibold tracking-[-0.22px] font-sans leading-none">{`${connection?.user?.username}`}</span>
                <span className="text-sm font-medium font-sans text-tertiary leading-none">
                  {connection?.user?.displayName}
                </span>
              </div>
              <ProfileImage user={connection.user} />
            </div>
          </div>
        }
      >
        <div className="!divide-y !divide-quaternary/20 pt-4">
          {(connection?.user?.twitter?.username ||
            connection?.user?.telegram?.username) && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <span className="text-sm font-semibold text-primary font-sans">
                Socials
              </span>
              <div className="flex flex-col gap-4">
                {connection?.user?.telegram?.username && (
                  <div
                    onClick={() => {
                      logClientEvent("user-profile-telegram-clicked", {});
                    }}
                  >
                    <LinkCardBox
                      label="Telegram"
                      value={`@${connection.user.telegram.username}`}
                      href={`https://t.me/${connection.user.telegram.username}`}
                    />
                  </div>
                )}
                {connection?.user?.twitter?.username && (
                  <div
                    onClick={() => {
                      logClientEvent("user-profile-twitter-clicked", {});
                    }}
                  >
                    <LinkCardBox
                      label="Twitter"
                      value={`@${connection.user.twitter.username}`}
                      href={`https://twitter.com/${connection.user.twitter.username}`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {connection?.user?.bio && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <>
                <span className="text-sm font-semibold text-primary font-sans">
                  Bio
                </span>
                <span className="text-sm text-secondary font-sans font-normal">
                  {connection?.user?.bio}
                </span>
              </>
            </div>
          )}

          {connection?.comment?.note && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <span className="text-sm font-semibold text-primary font-sans">
                Your Note
              </span>
              <span className="text-sm text-secondary font-sans font-normal">
                {connection?.comment?.note}
              </span>
            </div>
          )}

          {connection?.comment?.emoji && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <span className="text-sm font-semibold text-primary font-sans">
                Your Label
              </span>

              <p className="text-2xl mt-2">{connection?.comment?.emoji}</p>
            </div>
          )}

          {user.userData.lanna && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <span className="text-sm font-semibold text-primary font-sans">
                Connections{" "}
                <span className="font-normal text-tertiary">
                  where your encrypted data overlaps
                </span>
              </span>
              <InteractivePSI
                selfSigPK={user.userData.signaturePublicKey}
                otherSigPK={connection.user.signaturePublicKey}
                serializedPsiPrivateKey={user.serializedPsiPrivateKey}
                selfPsiPublicKeyLink={user.userData.psiPublicKeyLink}
                otherPsiPublicKeyLink={connection.user.psiPublicKeyLink}
                selfLannaData={user.userData.lanna}
              />
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

export default UserProfilePage;
