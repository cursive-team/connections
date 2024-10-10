/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { generateBitVectorFromLannaData, psiBlobUploadClient } from "@/lib/psi";
import init, { round1_js, round2_js, round3_js } from "@/lib/psi/mp_psi/mp_psi";
import { supabase } from "@/lib/realtime";
import { Card } from "@/components/cards/Card";
import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import { LannaData } from "@/lib/storage/types/user";

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
  selfLannaData: LannaData;
}

const InteractivePSI: React.FC<InteractivePSIProps> = ({
  selfSigPK,
  otherSigPK,
  serializedPsiPrivateKey,
  selfPsiPublicKeyLink,
  otherPsiPublicKeyLink,
  selfLannaData,
}) => {
  const [broadcastEvent, setBroadcastEvent] = useState<any>();

  const [psiState, setPsiState] = useState<PSIState>(PSIState.NOT_STARTED);
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
  const [overlapIndices, setOverlapIndices] = useState<number[]>([]);

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
  // TODO: Load in previous overlap indices if available
  const setupChannel = () => {
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
  };

  useEffect(() => {
    setupChannel();
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
        const selfBitVector = generateBitVectorFromLannaData(selfLannaData);

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
        setOverlapIndices(selfRound3Output || []);
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
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [otherUserTemporarilyLeft, psiState]);

  const handleInitiatePSI = () => {
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

  return (
    <Card.Base className="flex flex-col p-4 gap-6 bg-white rounded-lg border border-gray-200 mt-4 mb-8 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icons.Cards className="text-gray-600" />
          <span className="font-medium text-gray-800 text-sm font-inter">
            What do you both have in common?
          </span>
        </div>

        <span className="text-gray-600 font-inter text-xs font-normal">
          {psiState === PSIState.COMPLETE ? (
            "Overlap computed at the time you both opted into "
          ) : (
            <>
              If you both tap Discover <b>at the same time</b> we will privately
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
          <div className="flex flex-wrap gap-2">
            {overlapIndices.map((index) => {
              const interests = [
                "getHealthy",
                "enjoyMeals",
                "haveCoffee",
                "party",
                "attendTalks",
              ];
              const interest = interests[index];
              const emoji = {
                getHealthy: "🏃",
                enjoyMeals: "🍲",
                haveCoffee: "☕️",
                party: "🎉",
                attendTalks: "🤓",
              }[interest];

              return (
                <span
                  key={interest}
                  className="px-2 py-1 text-xs font-medium bg-[#FF9DF8] text-gray-800 rounded-full flex items-center gap-1"
                >
                  {emoji}{" "}
                  {interest.charAt(0).toUpperCase() +
                    interest.slice(1).replace(/([A-Z])/g, " $1")}
                </span>
              );
            })}
          </div>
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
        <AppButton
          type="button"
          onClick={handleInitiatePSI}
          size="md"
          variant="outline"
          disabled={!otherUserInChannel}
          className="text-[rgb(244,41,213)] border-[rgb(244,41,213)] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {wantsToInitiatePSI
            ? "Waiting for other user to accept..."
            : otherUserInChannel
            ? "Discover"
            : "Waiting for other user to connect..."}
        </AppButton>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 text-xs text-center">
            {PSIStateMapping[psiState]}
          </span>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[rgb(244,41,213)] transition-all duration-500 ease-in-out"
              style={{
                width: `${(100 * psiState) / PSIState.COMPLETE}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </Card.Base>
  );
};

export default InteractivePSI;
