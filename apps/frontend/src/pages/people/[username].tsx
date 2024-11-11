"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Connection, Session, User } from "@/lib/storage/types";
import { toast } from "sonner";
import { TapParams, ChipTapResponse, errorToString, SocketRequestType } from "@types";
import { AppButton } from "@/components/ui/Button";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import { AppTextarea } from "@/components/ui/Textarea";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { tensionPairs } from "@/common/constants";
import { hashCommit } from "@/lib/psi/hash";
import { BASE_API_URL } from "@/config";
import Link from "next/link";
import { TensionSlider } from "../tensions";
import { Icons } from "@/components/icons/Icons";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { sendMessages } from "@/lib/message";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/frontend/util";
import { Card } from "@/components/cards/Card";
import { getConnectionSigPubKey } from "@/lib/user";
import { useSocket, socketEmit } from "@/lib/socket";

interface CommentModalProps {
  username: string;
  displayName: string;
  pronouns: string;
  previousEmoji: string | undefined;
  previousNote: string | undefined;
  tapResponse: ChipTapResponse | undefined;
  onClose: () => void;
  onTapBack: () => Promise<void>;
  onSubmit: (emoji: string | null, note: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  username,
  displayName,
  pronouns,
  previousEmoji,
  previousNote,
  tapResponse,
  onClose,
  onTapBack,
  onSubmit,
}) => {
  const { darkTheme } = useSettings();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [privateNote, setPrivateNote] = useState("");
  const [hasTappedBack, setHasTappedBack] = useState(false);

  useEffect(() => {
    if (previousEmoji) {
      setSelectedEmoji(previousEmoji);
    }
    if (previousNote) {
      setPrivateNote(previousNote);
    }
  }, [previousEmoji, previousNote]);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/75 flex items-center justify-center z-50",
        darkTheme ? "bg-white/20" : "bg-black/75"
      )}
    >
      <div className="flex flex-col bg-background p-6 pb-10 rounded-[32px] w-full max-w-[90vw] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-label-tertiary hover:text-label-primary hover:text-white transition-colors"
        >
          <Icons.XClose size={24} className="text-icon-primary bg-background" />
        </button>
        <div className="size-[80px] relative flex mx-auto">
          <div className="absolute -left-3 size-8 rounded-full bg-[#9DE8FF] z-0 top-[28px] border border-quaternary/10"></div>
          <Image
            width={80}
            height={80}
            alt="connection artwork"
            src="/images/connection-artwork.svg"
            className="relative z-[1]"
          />
          <div className="absolute size-8 rounded-full bg-[#FFFF9D] -right-3 top-[28px] z-0 border border-quaternary/10"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col text-center">
            <span className="text-[20px] font-semibold text-label-primary tracking-[-0.1px] font-sans">
              {username}
            </span>
            <span className="text-label-secondary text-label-tertiary text-sm font-medium font-sans text-center">
              {displayName}
            </span>
            <span className="text-label-secondary text-label-tertiary text-sm font-medium font-sans text-center">
              {pronouns}
            </span>
          </div>
          {tapResponse && (
            <div className="flex flex-col mt-2">
              <AppButton
                onClick={async () => {
                  setHasTappedBack(true);
                  await onTapBack();
                }}
                disabled={hasTappedBack}
              >
                Share socials back
              </AppButton>
            </div>
          )}
          <span className="text-center text-xs text-label-tertiary font-medium font-sans">
            Add details to remember this connection. <br />
            They stay <strong className="font-bold">private to you.</strong>
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <span className="text-sm font-semibold text-label-primary font-sans">
            Labels
          </span>
          <div className="flex space-x-2 justify-around">
            {["💼", "🪩", "😊", "🎃", "🙈"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  logClientEvent("user-profile-emoji-selected", {
                    label: emoji,
                  });
                  handleEmojiSelect(emoji);
                }}
                className={cn(
                  `p-2 size-12 rounded-full border border-transparent duration-200 ${
                    selectedEmoji === emoji
                      ? "!border-primary !border-white"
                      : ""
                  }`,
                  darkTheme
                    ? selectedEmoji === emoji
                      ? "bg-[#FF9DF8] !border-[#FF9DF8]"
                      : "bg-transparent !border-white"
                    : selectedEmoji === emoji
                    ? "bg-[#FF9DF8]"
                    : "bg-[#f1f1f1]"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <span className="text-sm font-semibold text-label-primary font-sans">
            Notes
          </span>
          <AppTextarea
            value={privateNote}
            placeholder="Add details about when you connected now or later!"
            onChange={(e) => setPrivateNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <AppButton
            disabled={
              (selectedEmoji ?? "") === (previousEmoji ?? "") &&
              privateNote === (previousNote ?? "")
            }
            onClick={() => onSubmit(selectedEmoji, privateNote)}
          >
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
  const { darkTheme } = useSettings();
  const [session, setSession] = useState<Session | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tapInfo, setTapInfo] = useState<{
    tapParams: TapParams;
    tapResponse: ChipTapResponse;
  } | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [waitingForOtherUser, setWaitingForOtherUser] = useState(false);
  const [verifiedIntersection, setVerifiedIntersection] = useState<{
    tensions: string[];
    contacts: string[];
  } | null>(null);
  const [isUnregistered, setIsUnregistered] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchConnectionAndTapInfo = async () => {
      if (typeof username === "string") {
        const user = await storage.getUser();
        const session = await storage.getSession();
        const unregisteredUser = await storage.getUnregisteredUser();
        if ((!user || !session || !user.connections[username]) && !unregisteredUser) {
          console.error("User not found");
          toast.error("User not found");
          router.push("/people");
          return;
        }

        if (unregisteredUser) {
          setIsUnregistered(true);
        }

        if (user && session) {
          setUser(user);
          setSession(session);
          setConnection(user.connections[username]);
          const savedTapInfo = await storage.loadSavedTapInfo();
          // Delete saved tap info after fetching
          await storage.deleteSavedTapInfo();
          // Show tap modal if tap info is for current connection
          if (
            savedTapInfo &&
            savedTapInfo.tapResponse.userTap?.ownerUsername === username
          ) {
            logClientEvent("user-profile-tap-chip-modal-shown", {});
            setTapInfo(savedTapInfo);
            setShowCommentModal(true);
          }
        } else if (unregisteredUser) {
          // In unregistered user case, cannot do PSIs which require user object
          setConnection(unregisteredUser.connections[username]);
          const savedTapInfo = await storage.loadSavedTapInfo();
          // Delete saved tap info after fetching
          await storage.deleteSavedTapInfo();
          // Show tap modal if tap info is for current connection
          if (
            savedTapInfo &&
            savedTapInfo.tapResponse.userTap?.ownerUsername === username
          ) {
            logClientEvent("user-profile-tap-chip-modal-shown", {});
            setTapInfo(savedTapInfo);
            setShowCommentModal(true);
          }
        }
      }
    };

    fetchConnectionAndTapInfo();
  }, [username, router]);

  const handleCloseCommentModal = async () => {
    logClientEvent("user-profile-comment-modal-closed", {});
    setShowCommentModal(false);
    await storage.deleteSavedTapInfo();
  };

  const handleTapBack = async () => {
    logClientEvent("user-profile-tap-back-clicked", {});
    if (!session || !connection || !tapInfo?.tapResponse.chipIssuer) {
      toast.error("Failed to tap back");
      return;
    }

    const message = await storage.createTapBackMessage(
      connection.user.username,
      tapInfo.tapResponse.chipIssuer
    );
    try {
      await sendMessages({
        authToken: session.authTokenValue,
        messages: [message],
      });

      // Only need to emit, do not need response from server
      if (socket && user) {
        // Get recipient id (pub key)
        const recipient: string | null = getConnectionSigPubKey(user, connection.user.username);

        if (recipient) {
          socketEmit({
            socketInstance: socket,
            type: SocketRequestType.TAP_BACK,
            recipientSigPubKey: recipient,
          });
        }
      }

      toast.success("Tap back sent successfully!");
    } catch (error) {
      console.error("Error sending tap back:", error);
      toast.error("Failed to send tap back");
    }
  };

  const handleSubmitComment = async (emoji: string | null, note: string) => {
    logClientEvent("user-profile-comment-modal-saved", {
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
      setShowCommentModal(false);
      await storage.deleteSavedTapInfo();
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast(
        SupportToast(
          "",
          true,
          "Failed to add comment",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    }
  };

  const updatePSIOverlap = async () => {
    setRefreshLoading(true);
    if (!connection || !user) {
      setRefreshLoading(false);
      return;
    }

    try {
      let tensions: string[] = [];
      if (user.userData.tensionsRating?.revealAnswers) {
        const tensionData = tensionPairs.map((tension, index) =>
          user.userData.tensionsRating!.tensionRating[index] < 50
            ? tension[0]
            : tension[1]
        );
        tensions = await hashCommit(
          user.encryptionPrivateKey,
          connection.user.encryptionPublicKey,
          tensionData
        );
      }

      const contactData = Object.keys(user.connections);
      const contacts = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        contactData
      );

      const [secretHash] = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        [""]
      );

      const response = await fetch(
        `${BASE_API_URL}/user/refresh_intersection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secretHash,
            index: user.userData.username < connection.user.username ? 0 : 1,
            intersectionState: { tensions, contacts },
          }),
        }
      );


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${errorData.error}`);
      }

      if (socket && connection) {
        // Get recipient id (pub key)
        const recipient: string | null = getConnectionSigPubKey(user, connection.user.username);

        if (recipient) {
          socketEmit({
            socketInstance: socket,
            type: SocketRequestType.PSI,
            recipientSigPubKey: recipient,
          });
        }
      }

      const data = await response.json();

      if (data.success) {
        const translatedContacts = [];
        for (const hashContact of data.verifiedIntersectionState.contacts) {
          const index = contacts.findIndex(
            (contact) => contact === hashContact
          );
          if (index !== -1) {
            translatedContacts.push(contactData[index]);
          }
        }

        setVerifiedIntersection({
          contacts: translatedContacts,
          tensions: data.verifiedIntersectionState.tensions,
        });
        logClientEvent("user-finished-psi", {});
        if (!waitingForOtherUser) {
          toast.info(
            `Ask ${connection.user.username} to refresh to see results!`
          );
        }
        setWaitingForOtherUser(false);
      } else {
        toast.info(
          `Ask ${connection.user.username} to press "Discover" after tapping!`
        );
        setWaitingForOtherUser(true);
      }
    } catch (error) {
      console.error("Error updating PSI overlap:", error);
      toast(
        SupportToast(
          "",
          true,
          "Failed to update overlap. Please try again",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    } finally {
      setRefreshLoading(false);
    }
  };

  // Loading Cases:
  // 1: Is not unregistered user and no user info available yet
  // 2: Is unregistered user and connection info not available yet 
  if (((!connection || !user || !session) && !isUnregistered) || (!connection && isUnregistered)) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }



  return (
    <>
      {showCommentModal && !isUnregistered && (
        <CommentModal
          username={connection.user.username}
          displayName={connection.user.displayName}
          pronouns={connection.user.pronouns || ""}
          previousEmoji={connection.comment?.emoji}
          previousNote={connection.comment?.note}
          tapResponse={tapInfo?.tapResponse}
          onClose={handleCloseCommentModal}
          onTapBack={handleTapBack}
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
                <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans leading-none text-label-primary">{`${connection?.user?.username}`}</span>
                <span className="text-sm font-medium font-sans text-label-tertiary leading-none">
                  {connection?.user?.displayName}
                </span>
                <span className="text-sm font-medium font-sans text-label-tertiary leading-none">
                  {connection?.user?.pronouns}
                </span>
              </div>
              <ProfileImage user={connection.user} />
            </div>
            <div className="flex flex-row gap-2 mb-2">
              <div className="w-2/5">
                <AppButton
                  variant="outline"
                  onClick={() => {
                    logClientEvent("user-profile-begin-edit-comment", {});
                    if (isUnregistered) {
                      toast.error("Unregistered user cannot add contact notes. Come to the Cursive booth and" +
                        " register!");
                    }
                    setShowCommentModal(true);
                  }}
                >
                  {<Icons.Pencil className="text-icon-primary" />}{" "}
                  {connection?.comment?.emoji || connection?.comment?.note
                    ? "Edit Notes"
                    : "Add Notes"}
                </AppButton>
              </div>
            </div>
          </div>
        }
      >
        <div className="!divide-y !divide-quaternary/20">
          <div className="flex flex-col gap-2 py-4 px-4">
            <span className="text-sm font-semibold text-label-primary font-sans">
              Socials
            </span>
            <div className="flex flex-col gap-4">
              {!connection?.user?.telegram && !connection?.user?.twitter && (
                <span className="text-sm text-label-secondary font-sans font-normal">
                  No socials shared.
                </span>
              )}
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
              {connection?.user?.signal?.username && (
                <div
                  onClick={() => {
                    logClientEvent("user-profile-signal-clicked", {});
                  }}
                >
                  <LinkCardBox
                    label="Signal"
                    value={`@${connection.user.signal.username}`}
                    href={`https://signal.me/#u/${connection.user.signal.username}`}
                  />
                </div>
              )}
              {connection?.user?.instagram?.username && (
                <div
                  onClick={() => {
                    logClientEvent("user-profile-instagram-clicked", {});
                  }}
                >
                  <LinkCardBox
                    label="Instagram"
                    value={`@${connection.user.instagram.username}`}
                    href={`https://www.instagram.com/${connection.user.instagram.username}`}
                  />
                </div>
              )}
              {connection?.user?.farcaster?.username && (
                <div
                  onClick={() => {
                    logClientEvent("user-profile-farcaster-clicked", {});
                  }}
                >
                  <LinkCardBox
                    label="Farcaster"
                    value={`@${connection.user.farcaster.username}`}
                    href={`https://warpcast.com/${connection.user.farcaster.username}`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-4 px-4">
            <span className="text-sm font-semibold text-label-primary font-sans">
              Overlap icebreaker{" "}
              <span className="font-normal text-label-tertiary">
                Find common contacts & opposing tensions to spark conversation
              </span>
            </span>

            {verifiedIntersection && (
              <>
                <Card.Base
                  variant="gray"
                  className={cn(
                    "px-2 pt-2 pb-4 rounded-lg w-full  flex-col justify-start items-start gap-2 inline-flex",
                    darkTheme
                      ? "border !border-white"
                      : "border border-black/80"
                  )}
                >
                  <div className="text-sm font-semibold text-label-primary font-sans">
                    📇 Common contacts
                  </div>
                  {verifiedIntersection.contacts.length === 0 ? (
                    <div className="text-sm text-label-primary font-sans font-normal">
                      No common contacts.
                    </div>
                  ) : (
                    <div className="text-sm text-link-primary font-sans font-normal">
                      {verifiedIntersection.contacts.map((contact, index) => (
                        <>
                          <span className="text-label-primary">
                            {index !== 0 && " | "}
                          </span>
                          <Link href={`/people/${contact}`}>{contact}</Link>
                        </>
                      ))}
                    </div>
                  )}
                </Card.Base>
                <Card.Base
                  variant="gray"
                  className={cn(
                    "px-2 pt-2 pb-4 rounded-lg w-full  flex-col justify-start items-start gap-2 inline-flex",
                    darkTheme
                      ? "border !border-white"
                      : "border border-black/80"
                  )}
                >
                  <div className="text-sm font-semibold text-label-primary font-sans">
                    🪢 Your Tension disagreements
                  </div>

                  {verifiedIntersection.tensions.length === 0 ? (
                    <div className="text-sm text-label-primary font-sans font-normal">
                      Play the tensions game and refresh to see results!
                    </div>
                  ) : verifiedIntersection.tensions.every(
                      (tension) => tension === "0"
                    ) ? (
                    <div className="text-sm text-label-primary font-sans font-normal">
                      No tension disagreements!
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-normal text-label-primary font-sans">
                        {connection.user.username} leaned towards the opposite
                        side on these tensions. Below is what you picked.
                      </div>
                      {verifiedIntersection.tensions.map(
                        (tension, index) =>
                          tension === "1" && (
                            <TensionSlider
                              key={index}
                              leftOption={tensionPairs[index][0]}
                              rightOption={tensionPairs[index][1]}
                              value={
                                (user) ? user.userData.tensionsRating?.tensionRating[
                                  index
                                ] ?? 50 : 50
                              }
                              onChange={() => {}}
                            />
                          )
                      )}
                    </>
                  )}
                </Card.Base>
              </>
            )}

            <AppButton
              onClick={() => {
                logClientEvent("user-started-psi", {});
                if (isUnregistered) {
                  toast.error("Unregistered user cannot add run contact PSI. Come to the Cursive booth and register!");
                }
                updatePSIOverlap();
              }}
              variant="outline"
              loading={refreshLoading}
            >
              {verifiedIntersection || waitingForOtherUser
                ? "Refresh"
                : "Discover"}
              {}
            </AppButton>
            {waitingForOtherUser && (
              <div className="text-[12px] text-center text-label-primary font-sans font-normal">
                Waiting for {connection.user.username} to press discover after
                tapping...
              </div>
            )}
          </div>

          {connection?.user?.bio && (
            <div className="flex flex-col gap-2 py-4 px-4">
              <>
                <span className="text-sm font-semibold text-label-primary font-sans">
                  Bio
                </span>
                <span className="text-sm text-label-secondary font-sans font-normal">
                  {connection?.user?.bio}
                </span>
              </>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
};

export default UserProfilePage;
