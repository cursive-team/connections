import { AstrologyModal } from "@/components/modals/AstrologyModal";
import { ProfileImage } from "@/components/ui/ProfileImage";
import AppLayout from "@/layouts/AppLayout";
import { classed } from "@tw-classed/react";
import { NextSeo } from "next-seo";
import React, { ReactNode, useEffect, useState } from "react";
import { MdKeyboardArrowRight as ArrowRight } from "react-icons/md";
import { MdOutlineEdit as EditIcon } from "react-icons/md";
import { FaPlus as PlusIcon } from "react-icons/fa6";
import { FreakModal } from "@/components/modals/FreakModal";
import { SpookyModal } from "@/components/modals/SpookyModal";
import { User } from "@/lib/storage/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { logClientEvent } from "@/lib/frontend/metrics";
import {
  LANNA_HALLOWEEN_LOCATION_IDS,
  LANNA_HALLOWEEN_LOCATION_IDS_ARRAY,
} from "@/constants";
import { LannaHalloweenData } from "@/lib/storage/types/user/userData/lannaHalloweenData";
import {
  encryptWithPublicKey,
  getEnclavePublicKey,
} from "@/lib/dataHash/enclave";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";
import {
  ChipIssuer,
  CreateDataHashRequest,
  DataHashInput,
  HashableField,
  HashData,
} from "@types";
import { BASE_API_URL } from "@/config";

interface VaultCardProps {
  active?: boolean;
  title?: string;
  description?: string;
  icon?: ReactNode;
}
const VaultCardBase = classed.div("flex flex-col gap-1 p-3 rounded-lg", {
  variants: {
    active: {
      true: "bg-transparent border border-white",
      false: "bg-white/10",
    },
  },
  defaultVariants: {
    active: true,
  },
});

export const VaultCard = ({
  active = true,
  title,
  description,
  icon,
}: VaultCardProps) => {
  return (
    <VaultCardBase active={active}>
      <div className="flex items-center justify-between">
        <span className="text-primary text-sm font-normal">{title}</span>
        {icon && <div>{icon}</div>}
      </div>
      <span className="text-tertiary text-sm font-normal">{description}</span>
    </VaultCardBase>
  );
};

export default function HalloweenPage() {
  const router = useRouter();
  const [halloweenModalOpen, setHalloweenModalOpen] = useState(false);
  const [astrologyModalOpen, setAstrologyModalOpen] = useState(false);
  const [freakModalOpen, setFreakModalOpen] = useState(false);
  const [fortuneModalOpen, setFortuneModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadTap = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (!user || !session) {
        console.error("User not found");
        toast.error("User not found");
        router.push("/profile");
        return;
      }
      setUser(user);
      console.log(fortuneModalOpen);

      const savedTapInfo = await storage.loadSavedTapInfo();
      // Delete saved tap info after fetching
      await storage.deleteSavedTapInfo();
      // Show tap modal if tap info is for current location
      if (
        savedTapInfo &&
        savedTapInfo.tapResponse.locationTap?.locationId &&
        LANNA_HALLOWEEN_LOCATION_IDS_ARRAY.includes(
          savedTapInfo.tapResponse.locationTap.locationId
        )
      ) {
        logClientEvent("halloween-chip-modal-shown", {});
        const locationId = savedTapInfo.tapResponse.locationTap.locationId;
        if (locationId === LANNA_HALLOWEEN_LOCATION_IDS.main) {
          setHalloweenModalOpen(true);
        } else if (locationId === LANNA_HALLOWEEN_LOCATION_IDS.astrology) {
          setAstrologyModalOpen(true);
        } else if (locationId === LANNA_HALLOWEEN_LOCATION_IDS.freak) {
          setFreakModalOpen(true);
        } else if (locationId === LANNA_HALLOWEEN_LOCATION_IDS.fortune) {
          setFortuneModalOpen(true);
        }
      }
    };

    loadTap();
  }, [router]);

  const updateHashableField = (
    enclavePublicKey: string,
    previousField: HashableField,
    previousFieldWasNull: boolean,
    newFieldValue: string,
    hashPrefixString: string,
    repeatCount: number = 1,
    nullableFieldValue?: string | undefined
  ): { newField: HashableField; newHashInputs: DataHashInput[] } => {
    const enclavePublicKeyHash = sha256(enclavePublicKey);
    const hasChanged =
      previousFieldWasNull || previousField.value !== newFieldValue;
    const publicKeyUpdateRequired =
      previousField &&
      previousField.hashData.length > 0 &&
      previousField.hashData[0].enclavePublicKeyHash !== enclavePublicKeyHash;
    const nullifyField =
      nullableFieldValue && newFieldValue === nullableFieldValue;
    if (hasChanged || publicKeyUpdateRequired) {
      const previousHashes = previousField?.hashData || [];
      const newHashes: HashData[] = [];
      const newHashInputs: DataHashInput[] = [];
      for (let i = 0; i < repeatCount; i++) {
        const hashPrefix = `LANNA_HALLOWEEN_${hashPrefixString}_`;
        const hashPreimage = `${hashPrefix}${newFieldValue}`;
        let dataIdentifier = uuidv4();
        for (const hash of previousHashes) {
          if (hash.hashPrefix === hashPrefix) {
            dataIdentifier = hash.dataIdentifier;
            break;
          }
        }
        const hash = sha256(hashPreimage);
        const encryptedInput = encryptWithPublicKey(enclavePublicKey, hash);
        newHashInputs.push({
          dataIdentifier,
          encryptedInput: nullifyField ? null : encryptedInput,
        });
        if (!nullifyField) {
          newHashes.push({
            dataIdentifier,
            hashPrefix,
            enclavePublicKeyHash,
            lastUpdated: new Date(),
          });
        }
      }
      return {
        newField: {
          value: newFieldValue,
          hashData: newHashes,
        },
        newHashInputs,
      };
    }

    return {
      newField: previousField,
      newHashInputs: [],
    };
  };

  const updateHalloweenData = async (updateData: LannaHalloweenData) => {
    try {
      const { user, session } = await storage.getUserAndSession();
      const enclavePublicKey = await getEnclavePublicKey();
      const dataHashInputs: DataHashInput[] = [];

      const newUserData = user.userData;
      if (!newUserData.lannaHalloween) {
        newUserData.lannaHalloween = {};
      }

      // Mood handler
      if (updateData.mood) {
        let previousFieldWasNull = false;
        if (!newUserData.lannaHalloween.mood) {
          previousFieldWasNull = true;
          newUserData.lannaHalloween.mood = {
            value: updateData.mood.value,
            hashData: [],
          };
        }
        const { newField, newHashInputs } = updateHashableField(
          enclavePublicKey,
          newUserData.lannaHalloween.mood,
          previousFieldWasNull,
          updateData.mood.value,
          "MOOD",
          5
        );
        newUserData.lannaHalloween.mood = newField;
        dataHashInputs.push(...newHashInputs);
      }

      // Connection interests handler
      if (updateData.connectionInterests) {
        if (!newUserData.lannaHalloween.connectionInterests) {
          newUserData.lannaHalloween.connectionInterests = {};
        }

        // Handle each connection interest field
        if (updateData.connectionInterests.deepConversation) {
          let previousFieldWasNull = false;
          if (
            !newUserData.lannaHalloween.connectionInterests.deepConversation
          ) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.deepConversation = {
              value: updateData.connectionInterests.deepConversation.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.deepConversation,
            previousFieldWasNull,
            updateData.connectionInterests.deepConversation.value,
            "CONNECTION_INTERESTS_DEEP_CONVERSATION",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.deepConversation =
            newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.danceOff) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.danceOff) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.danceOff = {
              value: updateData.connectionInterests.danceOff.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.danceOff,
            previousFieldWasNull,
            updateData.connectionInterests.danceOff.value,
            "CONNECTION_INTERESTS_DANCE_OFF",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.danceOff = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.talkWork) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.talkWork) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.talkWork = {
              value: updateData.connectionInterests.talkWork.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.talkWork,
            previousFieldWasNull,
            updateData.connectionInterests.talkWork.value,
            "CONNECTION_INTERESTS_TALK_WORK",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.talkWork = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.congoLine) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.congoLine) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.congoLine = {
              value: updateData.connectionInterests.congoLine.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.congoLine,
            previousFieldWasNull,
            updateData.connectionInterests.congoLine.value,
            "CONNECTION_INTERESTS_CONGO_LINE",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.congoLine = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.beNPCs) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.beNPCs) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.beNPCs = {
              value: updateData.connectionInterests.beNPCs.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.beNPCs,
            previousFieldWasNull,
            updateData.connectionInterests.beNPCs.value,
            "CONNECTION_INTERESTS_BE_NPCS",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.beNPCs = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.pairFortune) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.pairFortune) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.pairFortune = {
              value: updateData.connectionInterests.pairFortune.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.pairFortune,
            previousFieldWasNull,
            updateData.connectionInterests.pairFortune.value,
            "CONNECTION_INTERESTS_PAIR_FORTUNE",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.pairFortune = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.teamUp) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.teamUp) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.teamUp = {
              value: updateData.connectionInterests.teamUp.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.teamUp,
            previousFieldWasNull,
            updateData.connectionInterests.teamUp.value,
            "CONNECTION_INTERESTS_TEAM_UP",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.teamUp = newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.chillAndVibe) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.chillAndVibe) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.chillAndVibe = {
              value: updateData.connectionInterests.chillAndVibe.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.chillAndVibe,
            previousFieldWasNull,
            updateData.connectionInterests.chillAndVibe.value,
            "CONNECTION_INTERESTS_CHILL_AND_VIBE",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.chillAndVibe =
            newField;
          dataHashInputs.push(...newHashInputs);
        }

        if (updateData.connectionInterests.introverse) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.connectionInterests.introverse) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.connectionInterests.introverse = {
              value: updateData.connectionInterests.introverse.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.connectionInterests.introverse,
            previousFieldWasNull,
            updateData.connectionInterests.introverse.value,
            "CONNECTION_INTERESTS_INTROVERSE",
            1,
            "false"
          );
          newUserData.lannaHalloween.connectionInterests.introverse = newField;
          dataHashInputs.push(...newHashInputs);
        }
      }

      // Astrology handler
      if (updateData.astrology) {
        if (!newUserData.lannaHalloween.astrology) {
          newUserData.lannaHalloween.astrology = {};
        }

        // Handle sun sign
        if (updateData.astrology.sunSign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.sunSign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.sunSign = {
              value: updateData.astrology.sunSign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.sunSign,
            previousFieldWasNull,
            updateData.astrology.sunSign.value,
            "ASTROLOGY_SUN_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.sunSign = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle moon sign
        if (updateData.astrology.moonSign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.moonSign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.moonSign = {
              value: updateData.astrology.moonSign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.moonSign,
            previousFieldWasNull,
            updateData.astrology.moonSign.value,
            "ASTROLOGY_MOON_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.moonSign = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle rising sign
        if (updateData.astrology.risingSign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.risingSign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.risingSign = {
              value: updateData.astrology.risingSign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.risingSign,
            previousFieldWasNull,
            updateData.astrology.risingSign.value,
            "ASTROLOGY_RISING_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.risingSign = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle mercury sign
        if (updateData.astrology.mercurySign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.mercurySign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.mercurySign = {
              value: updateData.astrology.mercurySign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.mercurySign,
            previousFieldWasNull,
            updateData.astrology.mercurySign.value,
            "ASTROLOGY_MERCURY_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.mercurySign = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle mars sign
        if (updateData.astrology.marsSign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.marsSign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.marsSign = {
              value: updateData.astrology.marsSign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.marsSign,
            previousFieldWasNull,
            updateData.astrology.marsSign.value,
            "ASTROLOGY_MARS_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.marsSign = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle venus sign
        if (updateData.astrology.venusSign) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.astrology.venusSign) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.astrology.venusSign = {
              value: updateData.astrology.venusSign.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.astrology.venusSign,
            previousFieldWasNull,
            updateData.astrology.venusSign.value,
            "ASTROLOGY_VENUS_SIGN",
            1
          );
          newUserData.lannaHalloween.astrology.venusSign = newField;
          dataHashInputs.push(...newHashInputs);
        }
      }

      // Fun handler
      if (updateData.fun) {
        if (!newUserData.lannaHalloween.fun) {
          newUserData.lannaHalloween.fun = {};
        }

        // Handle good times
        if (updateData.fun.goodTimes) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.fun.goodTimes) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.fun.goodTimes = {
              value: updateData.fun.goodTimes.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.fun.goodTimes,
            previousFieldWasNull,
            updateData.fun.goodTimes.value,
            "FUN_GOOD_TIMES",
            1
          );
          newUserData.lannaHalloween.fun.goodTimes = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle experiences
        if (updateData.fun.experiences) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.fun.experiences) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.fun.experiences = {
              value: updateData.fun.experiences.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.fun.experiences,
            previousFieldWasNull,
            updateData.fun.experiences.value,
            "FUN_EXPERIENCES",
            1
          );
          newUserData.lannaHalloween.fun.experiences = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle unusual items
        if (updateData.fun.unusualItems) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.fun.unusualItems) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.fun.unusualItems = {
              value: updateData.fun.unusualItems.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.fun.unusualItems,
            previousFieldWasNull,
            updateData.fun.unusualItems.value,
            "FUN_UNUSUAL_ITEMS",
            1
          );
          newUserData.lannaHalloween.fun.unusualItems = newField;
          dataHashInputs.push(...newHashInputs);
        }

        // Handle unique challenge
        if (updateData.fun.uniqueChallenge) {
          let previousFieldWasNull = false;
          if (!newUserData.lannaHalloween.fun.uniqueChallenge) {
            previousFieldWasNull = true;
            newUserData.lannaHalloween.fun.uniqueChallenge = {
              value: updateData.fun.uniqueChallenge.value,
              hashData: [],
            };
          }
          const { newField, newHashInputs } = updateHashableField(
            enclavePublicKey,
            newUserData.lannaHalloween.fun.uniqueChallenge,
            previousFieldWasNull,
            updateData.fun.uniqueChallenge.value,
            "FUN_UNIQUE_CHALLENGE",
            1
          );
          newUserData.lannaHalloween.fun.uniqueChallenge = newField;
          dataHashInputs.push(...newHashInputs);
        }
      }

      // Submit udpated data hashes
      const createDataHashRequest: CreateDataHashRequest = {
        authToken: session.authTokenValue,
        chipIssuer: ChipIssuer.EDGE_CITY_LANNA,
        locationId: LANNA_HALLOWEEN_LOCATION_IDS.main,
        enclavePublicKey,
        dataHashInputs,
      };

      const createDataHashResponse = await fetch(
        `${BASE_API_URL}/data_hash/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createDataHashRequest),
        }
      );
      if (!createDataHashResponse.ok) {
        throw new Error(`HTTP error! status: ${createDataHashResponse.status}`);
      }

      // Update user data
      await storage.updateUserData(newUserData);

      const newUser = await storage.getUser();
      if (newUser) {
        setUser(newUser);
      }
    } catch (error) {
      console.error("Error updating Halloween data", error);
      toast.error("Error submitting data");
    }
  };

  const submitSpookyData = async (updateData: LannaHalloweenData) => {
    await updateHalloweenData(updateData);
  };

  const submitAstrologyData = async (updateData: LannaHalloweenData) => {
    await updateHalloweenData(updateData);
    setAstrologyModalOpen(false);
  };

  const submitFreakData = async (updateData: LannaHalloweenData) => {
    await updateHalloweenData(updateData);
    setFreakModalOpen(false);
  };

  let username = "";
  if (user?.userData?.username) {
    username = " " + user?.userData?.username;
  }
  const halloweenSubmitted = user?.userData.lannaHalloween?.mood !== undefined;
  const astrologySubmitted =
    user?.userData.lannaHalloween?.astrology !== undefined;
  const freakSubmitted = user?.userData.lannaHalloween?.fun !== undefined;

  return (
    <>
      <NextSeo title="Halloween" />
      <SpookyModal
        setIsOpen={setHalloweenModalOpen}
        isOpen={halloweenModalOpen}
        username={username}
        onSubmit={submitSpookyData}
        onClose={() => {
          setHalloweenModalOpen(false);
        }}
      />
      <AstrologyModal
        setIsOpen={setAstrologyModalOpen}
        isOpen={astrologyModalOpen}
        username={username}
        onSubmit={submitAstrologyData}
      />
      <FreakModal
        setIsOpen={setFreakModalOpen}
        isOpen={freakModalOpen}
        onSubmit={submitFreakData}
      />
      <AppLayout
        showFooter={false}
        back={{
          href: "/",
          label: "Back",
        }}
        className="flex flex-col gap-4"
      >
        <div
          className="h-[135px] bg-slate-50 w-full rounded-lg overflow-hidden mt-4"
          style={{
            backgroundImage: `url('/images/halloween-party.svg')`,
            backgroundSize: "cover",
          }}
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-lg font-sans font-bold">
              Edge City Lanna Halloween Party
            </span>
            <span className="text-tertiary text-base font-sans font-normal">
              {`Happy Halloween! Find Curtis around
              the venue to tap into social connection. Be sure to visit the fortune 
              teller once you find your special someone to see if you two are compatible!`}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-primary text-base font-sans font-bold">
              Vault entries
            </span>
            <div className="flex flex-col gap-2">
              <VaultCard
                active={halloweenSubmitted}
                title="Spooky vibe check 🎃"
                description="Opt-in to match with residents who have similar or complimentary goals. "
                icon={
                  <button
                    onClick={() => {
                      setHalloweenModalOpen(true);
                    }}
                  >
                    {halloweenSubmitted ? (
                      <EditIcon size={18} className="text-white" />
                    ) : (
                      <PlusIcon size={18} className="text-white" />
                    )}
                  </button>
                }
              />
              <VaultCard
                active={astrologySubmitted}
                title="My astrology signs ✨"
                description="You can now match with residents who have similar or complimentary goals. "
                icon={
                  <button
                    onClick={() => {
                      setAstrologyModalOpen(true);
                    }}
                  >
                    {astrologySubmitted ? (
                      <EditIcon size={18} className="text-white" />
                    ) : (
                      <PlusIcon size={18} className="text-white" />
                    )}
                  </button>
                }
              />
              <VaultCard
                title="Match my freak 👹"
                description="You can now match with residents who have similar or complimentary goals. "
                icon={
                  <button
                    onClick={() => {
                      setFreakModalOpen(true);
                    }}
                  >
                    {freakSubmitted ? (
                      <EditIcon size={18} className="text-white" />
                    ) : (
                      <PlusIcon size={18} className="text-white" />
                    )}
                  </button>
                }
                active={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-10">
            <span className="text-primary text-base font-sans font-bold">
              Connections
            </span>
            <span className="text-tertiary text-base font-sans font-normal">
              {`Here's where you'll see your best fit connections. Message to meet up!`}
            </span>
            {user ? (
              <div className="flex gap-4 items-center">
                <ProfileImage user={user.userData} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium font-sans text-primary">
                    Lorem, ipsum dolor.
                  </span>
                  <span className="text-xs font-medium font-sans text-[#FF9DF8]">
                    @username
                  </span>
                </div>
                <ArrowRight size={18} className="text-white ml-auto" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
}
