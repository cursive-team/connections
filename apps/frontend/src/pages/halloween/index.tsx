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

  const updateHalloweenData = async (updateData: LannaHalloweenData) => {
    try {
      const { user, session } = await storage.getUserAndSession();
      const enclavePublicKey = await getEnclavePublicKey();
      const enclavePublicKeyHash = sha256(enclavePublicKey);
      const dataHashInputs: DataHashInput[] = [];

      const newUserData = user.userData;
      if (!newUserData.lannaHalloween) {
        newUserData.lannaHalloween = {};
      }

      // Mood handler
      if (updateData.mood) {
        if (!newUserData.lannaHalloween.mood) {
          newUserData.lannaHalloween.mood = {
            value: updateData.mood.value,
            hashData: [],
          };
        }
        const previousMood = newUserData.lannaHalloween.mood;
        const hasMoodChanged = previousMood !== updateData.mood;
        const publicKeyUpdateRequired =
          previousMood &&
          previousMood.hashData.length > 0 &&
          previousMood.hashData[0].enclavePublicKeyHash !==
            enclavePublicKeyHash;
        const previousHashes = previousMood?.hashData || [];
        const newHashes: HashData[] = [];
        if (hasMoodChanged || publicKeyUpdateRequired) {
          for (let i = 0; i < 5; i++) {
            const hashPrefix = `LANNA_HALLOWEEN_MOOD_${i}_`;
            const hashPreimage = `${hashPrefix}${updateData.mood.value}`;
            let dataIdentifier = uuidv4();
            for (const hash of previousHashes) {
              if (hash.hashPrefix === hashPrefix) {
                dataIdentifier = hash.dataIdentifier;
                break;
              }
            }
            const hash = sha256(hashPreimage);
            const encryptedInput = encryptWithPublicKey(enclavePublicKey, hash);
            dataHashInputs.push({
              dataIdentifier,
              encryptedInput,
            });
            newHashes.push({
              dataIdentifier,
              hashPrefix,
              enclavePublicKeyHash,
              lastUpdated: new Date(),
            });
          }

          newUserData.lannaHalloween.mood.value = updateData.mood.value;
          newUserData.lannaHalloween.mood.hashData = newHashes;
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
    setHalloweenModalOpen(false);
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
      />
      <AstrologyModal
        setIsOpen={setAstrologyModalOpen}
        isOpen={astrologyModalOpen}
        username={username}
      />
      <FreakModal setIsOpen={setFreakModalOpen} isOpen={freakModalOpen} />
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
