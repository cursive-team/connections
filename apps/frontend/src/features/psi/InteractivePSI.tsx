/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import {
  generateBitVectorFromUserData,
  getOverlapFromPSIResult,
  psiBlobUploadClient,
} from "@/lib/psi";
import init, { round1_js, round2_js, round3_js } from "@/lib/psi/mp_psi/mp_psi";
import { supabase } from "@/lib/realtime";
import { Card } from "@/components/cards/Card";
import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import { Connection, PSIData, UserData } from "@/lib/storage/types/user";
import { Tag } from "@/components/ui/Tag";
import { logClientEvent } from "@/lib/frontend/metrics";
import { LANNA_INTERESTS_EMOJI_MAPPING } from "@/common/constants";
import Link from "next/link";

enum PSIState {
  NOT_STARTED,
  ROUND1,
  ROUND2,
  ROUND3,
  COMPLETE,
}

const PSIStateMapping: Record<PSIState, string> = {
  [PSIState.NOT_STARTED]: "Not started",
  [PSIState.ROUND1]: "Creating collective encryption pubkey with 2PC...",
  [PSIState.ROUND2]: "Performing PSI with FHE...",
  [PSIState.ROUND3]: "Decrypting encrypted results with 2PC...",
  [PSIState.COMPLETE]: "Complete",
};

interface InteractivePSIProps {
  selfSigPK: string;
  otherSigPK: string;
  serializedPsiPrivateKey: string;
  selfPsiPublicKeyLink: string;
  otherPsiPublicKeyLink: string;
  userData: UserData;
  connections: Record<string, Connection>;
  existingPSIOverlap: PSIData | undefined;
  savePSIOverlap: (overlap: PSIData) => Promise<void>;
}

const InteractivePSI: React.FC<InteractivePSIProps> = ({
  selfSigPK,
  otherSigPK,
  serializedPsiPrivateKey,
  selfPsiPublicKeyLink,
  otherPsiPublicKeyLink,
  userData,
  connections,
  existingPSIOverlap,
  savePSIOverlap,
}) => {
  const [psiState, setPsiState] = useState<PSIState>(PSIState.NOT_STARTED);
  const [broadcastEvent, setBroadcastEvent] = useState<any>();
  const [selfRound1Output, setSelfRound1Output] = useState<any>();
  const [otherRound2MessageLink, setOtherRound2MessageLink] =
    useState<string>();
  const [selfRound2Output, setSelfRound2Output] = useState<any>();
  const [round2Order, setRound2Order] = useState<boolean>();
  const [otherRound3MessageLink, setOtherRound3MessageLink] =
    useState<string>();
  const [selfRound3Output, setSelfRound3Output] = useState<any>();

  const [wantsToInitiatePSI, setWantsToInitiatePSI] = useState(false);
  const [otherUserWantsToInitiatePSI, setOtherUserWantsToInitiatePSI] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUserInChannel, setCurrentUserInChannel] = useState(false);
  const [otherUserInChannel, setOtherUserInChannel] = useState(false);
  const [otherUserTemporarilyLeft, setOtherUserTemporarilyLeft] =
    useState(false);
  const [indexMapping, setIndexMapping] = useState<
    Record<number, string[]> | undefined
  >();
  const [overlap, setOverlap] = useState<PSIData>();

  useEffect(() => {
    if (wantsToInitiatePSI && otherUserWantsToInitiatePSI) {
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
      console.log("Both users want to initiate psi, starting psi...");
    }
  }, [wantsToInitiatePSI, otherUserWantsToInitiatePSI]);

  const getChannelName = () => {
    return [selfSigPK, otherSigPK].sort().join("-");
  };

  // set up channel for PSI
  useEffect(() => {
    if (existingPSIOverlap) {
      setOverlap(existingPSIOverlap);
      setPsiState(PSIState.COMPLETE);
    }

    const channel = supabase.channel(getChannelName(), {
      config: {
        presence: { key: selfSigPK },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setCurrentUserInChannel(true);
        const newState = channel.presenceState();
        if (Object.keys(newState).includes(otherSigPK)) {
          console.log("Other user in channel ", otherSigPK);
          setOtherUserInChannel(true);
          setOtherUserTemporarilyLeft(false);
        }
      })
      .on("presence", { event: "leave" }, async ({ key }: { key: string }) => {
        if (key === otherSigPK) {
          console.log("Other user left channel ", otherSigPK);
          setOtherUserTemporarilyLeft(true);
          setOtherUserInChannel(false);
        } else {
          setCurrentUserInChannel(false);
        }
      })
      .on("broadcast", { event: "initiatePSI" }, async (event: any) => {
        // only respond to initiatePSI if it's for this user
        if (event.payload.to !== selfSigPK) return;
        console.log("Other user wants to initiate psi", otherSigPK);
        setOtherUserWantsToInitiatePSI(true);
      })
      .on("broadcast", { event: "message" }, (event: any) => {
        setBroadcastEvent(event);
      })
      .subscribe(async (status: any) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user: selfSigPK,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // const closeChannel = async () => {
  //   await supabase.removeChannel(supabase.channel(getChannelName()));
  // };

  // process broadcast events
  useEffect(() => {
    if (!broadcastEvent) return;

    console.log(broadcastEvent);

    const { payload } = broadcastEvent;
    if (payload.state === PSIState.ROUND2 && payload.to === selfSigPK) {
      setOtherRound2MessageLink(payload.data);
      setRound2Order(otherSigPK > selfSigPK);
    } else if (payload.state === PSIState.ROUND3 && payload.to === selfSigPK) {
      setOtherRound3MessageLink(payload.data);
    }
  }, [broadcastEvent, selfSigPK, otherSigPK]);

  // process state changes
  useEffect(() => {
    if (
      selfRound1Output &&
      otherRound2MessageLink &&
      round2Order !== undefined &&
      psiState === PSIState.ROUND1
    ) {
      setPsiState(PSIState.ROUND2);
    } else if (
      selfRound2Output &&
      otherRound3MessageLink &&
      psiState === PSIState.ROUND2
    ) {
      setPsiState(PSIState.ROUND3);
    } else if (selfRound3Output && psiState === PSIState.ROUND3) {
      setPsiState(PSIState.COMPLETE);
    }
  }, [
    psiState,
    selfRound1Output,
    otherRound2MessageLink,
    round2Order,
    selfRound2Output,
    otherRound3MessageLink,
    selfRound3Output,
  ]);

  useEffect(() => {
    async function handleOverlapRounds() {
      const psiPrivateKey = JSON.parse(serializedPsiPrivateKey);

      if (psiState === PSIState.ROUND1) {
        logClientEvent("interactive-psi-round1", {});
        const { bitVector: selfBitVector, indexMapping: selfIndexMapping } =
          generateBitVectorFromUserData(userData, connections);
        setIndexMapping(selfIndexMapping);

        await init();
        const round1Output = round1_js(
          {
            psi_keys: psiPrivateKey,
            message_round1: JSON.parse(
              await fetch(selfPsiPublicKeyLink).then((res) => res.text())
            ),
          },
          JSON.parse(
            await fetch(otherPsiPublicKeyLink).then((res) => res.text())
          ),
          selfBitVector
        );
        setSelfRound1Output(round1Output);

        const round2MessageLink = await psiBlobUploadClient(
          "round2Message",
          JSON.stringify(round1Output.message_round2)
        );

        supabase.channel(getChannelName()).send({
          type: "broadcast",
          event: "message",
          payload: {
            state: PSIState.ROUND2,
            data: round2MessageLink,
            to: otherSigPK,
          },
        });
      } else if (psiState === PSIState.ROUND2) {
        logClientEvent("interactive-psi-round2", {});
        await init();
        const round2Output = round2_js(
          {
            psi_keys: psiPrivateKey,
            message_round1: JSON.parse(
              await fetch(selfPsiPublicKeyLink).then((res) => res.text())
            ),
          },
          selfRound1Output,
          JSON.parse(
            await fetch(otherRound2MessageLink!).then((res) => res.text())
          ),
          round2Order!
        );
        setSelfRound2Output(round2Output);

        const round3MessageLink = await psiBlobUploadClient(
          "round3Message",
          JSON.stringify(round2Output.message_round3)
        );

        supabase.channel(getChannelName()).send({
          type: "broadcast",
          event: "message",
          payload: {
            state: PSIState.ROUND3,
            data: round3MessageLink,
            to: otherSigPK,
          },
        });
      } else if (psiState === PSIState.ROUND3) {
        logClientEvent("interactive-psi-round3", {});
        await init();
        const psiOutput = round3_js(
          selfRound2Output!,
          JSON.parse(
            await fetch(otherRound3MessageLink!).then((res) => res.text())
          )
        );

        const overlapIndices = [];
        for (let i = 0; i < psiOutput.length; i++) {
          if (psiOutput[i] === 1) {
            overlapIndices.push(i);
          }
        }

        setSelfRound3Output(overlapIndices);
      } else if (psiState === PSIState.COMPLETE) {
        console.log("psi entered complete state");
        if (selfRound3Output && indexMapping) {
          logClientEvent("interactive-psi-overlap-saved", {});
          console.log("saving psi overlap");
          const overlap = getOverlapFromPSIResult(
            selfRound3Output || [],
            indexMapping || {}
          );
          await savePSIOverlap(overlap);
          setOverlap(overlap);
        } else {
          logClientEvent("interactive-psi-complete-cached", {});
          console.log("psi complete cached");
        }
      }
    }

    handleOverlapRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psiState, selfSigPK, otherSigPK]);

  useEffect(() => {
    if (otherUserTemporarilyLeft) {
      const currentState = psiState;
      const timer = setTimeout(() => {
        if (psiState === currentState) {
          console.log(
            "Resetting PSI due to other user temporarily leaving",
            currentState,
            psiState
          );
          setPsiState(PSIState.NOT_STARTED);
          setSelfRound1Output(undefined);
          setOtherRound2MessageLink(undefined);
          setSelfRound2Output(undefined);
          setOtherRound3MessageLink(undefined);
          setSelfRound3Output(undefined);
          setOtherUserInChannel(false);
          setOtherUserTemporarilyLeft(false);
          setWantsToInitiatePSI(false);
          setOtherUserWantsToInitiatePSI(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [otherUserTemporarilyLeft, psiState]);

  const handleInitiatePSI = () => {
    logClientEvent("interactive-psi-initiate", {});
    console.log(
      "Initiating psi...",
      wantsToInitiatePSI,
      otherUserWantsToInitiatePSI
    );

    setWantsToInitiatePSI(true);
    supabase.channel(getChannelName()).send({
      type: "broadcast",
      event: "initiatePSI",
      payload: {
        to: otherSigPK,
      },
    });

    // start psi if other user is already interested
    if (otherUserWantsToInitiatePSI) {
      console.log("Starting psi after other user initiating PSI", otherSigPK);
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
    }
  };

  const handleUpdatePSI = () => {
    logClientEvent("interactive-psi-update", {});
    console.log(
      "Updating psi...",
      wantsToInitiatePSI,
      otherUserWantsToInitiatePSI
    );

    setSelfRound1Output(undefined);
    setOtherRound2MessageLink(undefined);
    setSelfRound2Output(undefined);
    setOtherRound3MessageLink(undefined);
    setSelfRound3Output(undefined);
    supabase.channel(getChannelName()).send({
      type: "broadcast",
      event: "initiatePSI",
      payload: {
        to: otherSigPK,
      },
    });

    // start psi if other user is already interested
    if (otherUserWantsToInitiatePSI) {
      console.log("Starting psi after other user initiating PSI", otherSigPK);
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
    } else {
      console.log("Setting wants to initiate PSI after update", otherSigPK);
      setWantsToInitiatePSI(true);
      setPsiState(PSIState.NOT_STARTED);
    }
  };

  const getOverlapDisplay = () => {
    if (!overlap) return null;

    return (
      <div className="flex flex-col gap-4">
        {overlap?.sharedConnections && overlap.sharedConnections.length > 0 && (
          <div>
            <h3 className="font-medium text-bold text-primary text-sm font-sans mb-2">
              Shared Connections
            </h3>
            <ul className="list-disc list-inside">
              {overlap.sharedConnections.map((user, index) => (
                <li key={index} className="text-tertiary text-sm">
                  <Link href={`/people/${user}`}>{user}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {overlap?.sharedLannaInterests &&
          overlap.sharedLannaInterests.length > 0 && (
            <div>
              <h3 className="font-medium text-bold text-primary text-sm font-sans mb-2">
                Lanna Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {overlap.sharedLannaInterests.map((sharedInterest) => {
                  const emoji = LANNA_INTERESTS_EMOJI_MAPPING[sharedInterest];

                  return (
                    <Tag
                      key={sharedInterest}
                      emoji={emoji}
                      variant="active"
                      closable={false}
                      text={
                        sharedInterest.charAt(0).toUpperCase() +
                        sharedInterest.slice(1).replace(/([A-Z])/g, " $1")
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <Card.Base className="relative flex flex-col !border-none p-4 gap-6 !bg-[#F1F1F1] rounded-lg border mb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icons.Cards className="text-tertiary" />
          <span className="font-medium text-primary text-sm font-sans">
            What do you both have in common?
          </span>
        </div>

        <span className="text-tertiary font-sans text-xs font-medium">
          {psiState === PSIState.COMPLETE ? (
            "Overlap computed at the time you both opted into "
          ) : (
            <>
              If you both tap discover <b>at the same time</b> we will privately
              compute any overlap using
            </>
          )}
          <a
            href="https://github.com/cursive-team/2P-PSI/tree/vivek/wasm-2p-psi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link-primary hover:underline"
          >
            {" "}
            2PC + FHE
          </a>
          .
        </span>
      </div>
      {psiState === PSIState.COMPLETE ? (
        <div className="flex flex-col gap-1">
          {getOverlapDisplay()}
          <AppButton
            type="button"
            onClick={handleUpdatePSI}
            size="md"
            variant="outline"
            className="mt-4 text-[rgb(244,41,213)] border-[rgb(244,41,213)] hover:bg-blue-50"
          >
            Update
          </AppButton>
        </div>
      ) : psiState === PSIState.NOT_STARTED ? (
        <div className="flex flex-col gap-1">
          {getOverlapDisplay()}
          <AppButton
            type="button"
            onClick={handleInitiatePSI}
            size="md"
            variant="outline"
            disabled={!otherUserInChannel}
            className="mt-4 text-[rgb(244,41,213)] border-[rgb(244,41,213)] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {wantsToInitiatePSI
              ? "Waiting for other user to accept..."
              : otherUserInChannel
              ? "Discover"
              : "Waiting for other user to connect..."}
          </AppButton>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-tertiary text-xs text-center font-sans">
              {PSIStateMapping[psiState]}
            </span>
          </div>
          <div className="absolute left-0 bottom-0 right-0 h-1 bg-black/15 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[rgb(244,41,213)] transition-all duration-500 ease-in-out"
              style={{
                width: `${(100 * psiState) / PSIState.COMPLETE}%`,
              }}
            ></div>
          </div>
        </>
      )}
    </Card.Base>
  );
};

export default InteractivePSI;
