import React, { useEffect, useState } from "react";
import { generateSelfBitVector, psiBlobUploadClient } from "@/lib/psi";
import init, { round1_js, round2_js, round3_js } from "@/lib/psi/mp_psi/mp_psi";
import { supabase } from "@/lib/realtime";
import { toast } from "sonner";
import { CircleCard } from "@/components/ui/CircleCard";
import { Card } from "@/components/cards/Card";
import { Icons } from "@/components/Icons";
import { IconCircle } from "@/components/ui/FeedContent";
import { AppButton } from "@/components/ui/Button";

enum PSIState {
  NOT_STARTED,
  ROUND1,
  ROUND2,
  ROUND3,
  JUBSIGNAL,
  COMPLETE,
}

const PSIStateMapping: Record<PSIState, string> = {
  [PSIState.NOT_STARTED]: "Not started",
  [PSIState.ROUND1]: "Creating collective encryption pubkey with 2PC...",
  [PSIState.ROUND2]: "Performing PSI with FHE...",
  [PSIState.ROUND3]: "Decrypting encrypted results with 2PC...",
  [PSIState.JUBSIGNAL]: "Creating encrypted backup of overlap...",
  [PSIState.COMPLETE]: "Complete",
};

const InteractivePSI: React.FC = () => {
  const [selfEncPk, setSelfEncPk] = useState<string>();
  const [otherEncPk, setOtherEncPk] = useState<string>();
  const [channelName, setChannelName] = useState<string>();
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
  const [currentUserInChannel, setCurrentUserInChannel] = useState(false);
  const [otherUserInChannel, setOtherUserInChannel] = useState(false);
  const [otherUserTemporarilyLeft, setOtherUserTemporarilyLeft] =
    useState(false);

  const [userOverlap, setUserOverlap] = useState<
    { userId: string; name: string }[]
  >([]);

  useEffect(() => {
    if (wantsToInitiatePSI && otherUserWantsToInitiatePSI) {
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
      console.log("Both users want to initiate psi, starting psi...");
    }
  }, [wantsToInitiatePSI, otherUserWantsToInitiatePSI]);

  // set up channel for PSI
  const setupChannel = () => {
    if (!selfEncPk || !otherEncPk || !channelName) return;

    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: selfEncPk },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setCurrentUserInChannel(true);
        const newState = channel.presenceState();
        if (Object.keys(newState).includes(otherEncPk)) {
          console.log("Other user in channel ", otherEncPk);
          setOtherUserInChannel(true);
          setOtherUserTemporarilyLeft(false);
        }
      })
      .on("presence", { event: "leave" }, async ({ key }) => {
        if (key === otherEncPk) {
          console.log("Other user left channel ", otherEncPk);
          setOtherUserTemporarilyLeft(true);
          setOtherUserInChannel(false);
        } else {
          setCurrentUserInChannel(false);
        }
      })
      .on("broadcast", { event: "initiatePSI" }, async (event: any) => {
        // only respond to initiatePSI if it's for this user
        if (event.payload.to !== selfEncPk) return;
        console.log("Other user wants to initiate psi", otherEncPk);
        setOtherUserWantsToInitiatePSI(true);
      })
      .on("broadcast", { event: "message" }, (event: any) => {
        setBroadcastEvent(event);
      })
      .subscribe(async (status: any) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user: selfEncPk,
          });
        }
      });
  };

  const closeChannel = async () => {
    if (!channelName) return;
    await supabase.removeChannel(supabase.channel(channelName));
  };

  const processOverlap = (overlap: number[]) => {
    const users = getUsers();
    const locations = getLocationSignatures();
    let locationOverlapIds = [];
    let userOverlapIds = [];

    for (let i = 0; i < overlap.length; i++) {
      if (overlap[i] >= 1000) {
        continue;
      } else if (overlap[i] > 500) {
        const locationId = (overlap[i] - 500).toString();
        locationOverlapIds.push({
          locationId,
          name: locations[locationId].name,
        });
      } else {
        for (const userId in users) {
          if (parseInt(users[userId].pkId) === overlap[i]) {
            userOverlapIds.push({
              userId,
              name: users[userId].name,
            });
          }
        }
      }
    }
    // console.log(userOverlapIds);
    setUserOverlap(userOverlapIds);
    setLocationOverlap(locationOverlapIds);
  };

  // process broadcast events
  useEffect(() => {
    if (!broadcastEvent) return;

    console.log(broadcastEvent);

    const { payload } = broadcastEvent;
    if (payload.state === PSIState.ROUND2 && payload.to === selfEncPk) {
      setOtherRound2MessageLink(payload.data);
      setRound2Order(parseInt(payload.otherPkId) > parseInt(user?.pkId!));
    } else if (payload.state === PSIState.ROUND3 && payload.to === selfEncPk) {
      setOtherRound3MessageLink(payload.data);
    }
  }, [broadcastEvent, user?.pkId, selfEncPk]);

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
      setPsiState(PSIState.JUBSIGNAL);
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
      if (!selfEncPk || !otherEncPk || !channelName) return;

      const keys = getKeys();
      if (!keys) return;
      const { psiPrivateKeys, psiPublicKeysLink } = keys;

      if (psiState === PSIState.ROUND1) {
        logClientEvent("psiRound1", {});
        const selfBitVector = generateSelfBitVector();
        const otherPsiPublicKeysLink = user?.psiPkLink;

        await init();
        const round1Output = round1_js(
          {
            psi_keys: psiPrivateKeys,
            message_round1: JSON.parse(
              await fetch(psiPublicKeysLink).then((res) => res.text())
            ),
          },
          JSON.parse(
            await fetch(otherPsiPublicKeysLink!).then((res) => res.text())
          ),
          selfBitVector
        );
        setSelfRound1Output(round1Output);

        const round2MessageLink = await psiBlobUploadClient(
          "round2Message",
          JSON.stringify(round1Output.message_round2)
        );

        supabase.channel(channelName).send({
          type: "broadcast",
          event: "message",
          payload: {
            state: PSIState.ROUND2,
            data: round2MessageLink,
            to: otherEncPk,
            otherPkId: user?.pkId, // hacky way of getting our own pkId
          },
        });
      } else if (psiState === PSIState.ROUND2) {
        logClientEvent("psiRound2", {});
        await init();
        const round2Output = round2_js(
          {
            psi_keys: psiPrivateKeys,
            message_round1: JSON.parse(
              await fetch(psiPublicKeysLink).then((res) => res.text())
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

        supabase.channel(channelName).send({
          type: "broadcast",
          event: "message",
          payload: {
            state: PSIState.ROUND3,
            data: round3MessageLink,
            to: otherEncPk,
          },
        });
      } else if (psiState === PSIState.ROUND3) {
        logClientEvent("psiRound3", {});
        await init();
        const psiOutput = round3_js(
          selfRound2Output!,
          JSON.parse(
            await fetch(otherRound3MessageLink!).then((res) => res.text())
          )
        );
        let overlapIndices = [];
        for (let i = 0; i < psiOutput.length; i++) {
          if (psiOutput[i] === 1) {
            overlapIndices.push(i);
          }
        }

        setSelfRound3Output(overlapIndices);
      } else if (psiState === PSIState.JUBSIGNAL) {
        logClientEvent("psiRoundJubsSignal", {});
        await closeChannel();

        const encryptedMessage = await encryptOverlapComputedMessage(
          selfRound3Output,
          id?.toString()!,
          keys.encryptionPrivateKey,
          selfEncPk
        );

        try {
          await loadMessages({
            forceRefresh: false,
            messageRequests: [
              {
                encryptedMessage,
                recipientPublicKey: selfEncPk,
              },
            ],
          });
        } catch (error) {
          console.error(
            "Error sending encrypted location tap to server: ",
            error
          );
          toast.error(
            "An error occured while processing the tap. Please try again."
          );
          router.push("/");
          return;
        }

        processOverlap(selfRound3Output || []);
        setPsiState(PSIState.COMPLETE);
      }
    }

    handleOverlapRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psiState, selfEncPk, otherEncPk, channelName]);

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

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof id === "string") {
        const profile = getProfile();
        const keys = getKeys();
        if (!profile || !keys) {
          toast.error("You must be logged in to view this page.");
          router.push("/");
          return;
        }

        const fetchedUser = fetchUserByUUID(id);
        setUser(fetchedUser);

        if (fetchedUser) {
          // set psi info
          setOtherEncPk(fetchedUser.encPk);
          setSelfEncPk(profile.encryptionPublicKey);
          setChannelName(
            [fetchedUser.encPk, profile.encryptionPublicKey].sort().join("")
          );
          // always set up channel
          setupChannel();
          if (fetchedUser.oI) {
            processOverlap(JSON.parse(fetchedUser.oI));
            setPsiState(PSIState.COMPLETE);
          }

          // get talks info
          const talksResponse = await fetch(
            `/api/user/get_talks?encPk=${encodeURIComponent(fetchedUser.encPk)}`
          );
          if (talksResponse.ok) {
            const talksData = await talksResponse.json();
            setUserTalkInfo(talksData.talks);
          }

          // get github info
          if (
            !userGithubInfo &&
            githubSession &&
            (githubSession as any).accessToken &&
            fetchedUser.ghUserId &&
            !isNaN(parseInt(fetchedUser.ghUserId, 10))
          ) {
            setGithubInfoLoading(true);
            const userGithubId = parseInt(fetchedUser.ghUserId, 10);
            type GithubRepoData = {
              author_id: number;
              id: number;
              commits: number;
              first_commit_date: string;
              name: string;
              rank: number;
            }[];
            // type GithubData = {
            //   "alloy-rs": GithubRepoData;
            //   "axiom-crypto": GithubRepoData;
            //   bluealloy: GithubRepoData;
            //   chainbound: GithubRepoData;
            //   "cursive-team": GithubRepoData;
            //   "ethereum-optimism": GithubRepoData;
            //   ethereum: GithubRepoData;
            //   flashbots: GithubRepoData;
            //   "foundry-rs": GithubRepoData;
            //   paradigmxyz: GithubRepoData;
            //   primitivefinance: GithubRepoData;
            //   risc0: GithubRepoData;
            //   risechain: GithubRepoData;
            //   "shadow-hq": GithubRepoData;
            //   sigp: GithubRepoData;
            //   SorellaLabs: GithubRepoData;
            //   succinctlabs: GithubRepoData;
            //   wevm: GithubRepoData;
            //   taikoxyz: GithubRepoData;
            // };
            const fetchedGithubData = githubData as Record<
              string,
              GithubRepoData
            >;

            const userContributions: RepoContributionData[] = [];
            Object.keys(fetchedGithubData).forEach((repo) => {
              const repoData = fetchedGithubData[repo];
              repoData.forEach((entry) => {
                if (entry.author_id === userGithubId) {
                  userContributions.push({
                    repo,
                    first: new Date(entry.first_commit_date),
                    total: entry.commits,
                    rank: entry.rank,
                  });
                }
              });
            });

            setUserGithubInfo(userContributions);
            setGithubInfoLoading(false);
          }
        }
      }
    };
    fetchUser();
  }, [id, router, githubSession, userGithubInfo]);

  const handleInitiatePSI = () => {
    if (!user || !channelName || !otherEncPk) return;

    console.log(
      "Initiating psi...",
      wantsToInitiatePSI,
      otherUserWantsToInitiatePSI
    );

    logClientEvent("psiInitiatePSI", {});
    setWantsToInitiatePSI(true);
    supabase.channel(channelName).send({
      type: "broadcast",
      event: "initiatePSI",
      payload: {
        to: otherEncPk,
      },
    });

    // start psi if other user is already interested
    if (otherUserWantsToInitiatePSI) {
      console.log("Starting psi after other user initiating PSI", otherEncPk);
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
    }
  };

  const handleUpdatePSI = () => {
    if (!user || !channelName || !otherEncPk) return;

    console.log(
      "Updating psi...",
      wantsToInitiatePSI,
      otherUserWantsToInitiatePSI
    );

    logClientEvent("psiUpdatePSI", {});
    setSelfRound1Output(undefined);
    setOtherRound2MessageLink(undefined);
    setSelfRound2Output(undefined);
    setOtherRound3MessageLink(undefined);
    setSelfRound3Output(undefined);
    supabase.channel(channelName).send({
      type: "broadcast",
      event: "initiatePSI",
      payload: {
        to: otherEncPk,
      },
    });

    // start psi if other user is already interested
    if (otherUserWantsToInitiatePSI) {
      console.log("Starting psi after other user initiating PSI", otherEncPk);
      setWantsToInitiatePSI(false);
      setOtherUserWantsToInitiatePSI(false);
      setPsiState(PSIState.ROUND1);
    } else {
      console.log("Setting wants to initiate PSI after update", otherEncPk);
      setWantsToInitiatePSI(true);
      setPsiState(PSIState.NOT_STARTED);
    }
  };

  return (
    <Card.Base className="flex flex-col p-4 gap-6 !bg-gray/20 !rounded-none !border-white/20 mt-4 mb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icons.Cards className="text-secondary" />
          <span className="font-medium text-white text-sm font-inter">
            What do you both have in common?
          </span>
        </div>

        <span className="text-white/50 font-inter text-xs font-normal">
          {isOverlapComputed ? (
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
          >
            {" "}
            <u>2PC + FHE</u>.
          </a>
        </span>
      </div>
      {isOverlapComputed ? (
        <div className="flex flex-col gap-1">
          {userOverlap.map(({ userId, name }, index) => {
            return (
              <div
                onClick={() => {
                  window.location.href = `/users/${userId}`;
                }}
                key={index}
              >
                <div className="flex justify-between border-b w-full border-gray-300  last-of-type:border-none first-of-type:pt-0 py-1">
                  <div className="flex items-center gap-2">
                    <IconCircle>
                      <CircleCard icon="person" />
                    </IconCircle>
                    <Card.Title>{name}</Card.Title>
                  </div>
                </div>
              </div>
            );
          })}
          <AppButton
            type="button"
            onClick={handleUpdatePSI}
            size="md"
            variant="outline"
            style={{
              marginTop: "16px",
            }}
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
        >
          {wantsToInitiatePSI
            ? "Waiting for other user to accept..."
            : otherUserInChannel
            ? "Discover"
            : "Waiting for other user to connect..."}
        </AppButton>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-white text-xs text-center">
            {PSIStateMapping[psiState]}
          </span>
          <div className="relative">
            <Card.Progress
              style={{
                width: `${(100 * psiState) / PSIState.COMPLETE}%`,
              }}
            />
          </div>
        </div>
      )}
    </Card.Base>
  );
};

export default InteractivePSI;
