import {
  tensionPairs,
  hotTakeLabels
} from "@/common/constants";
import { hashCommit } from "@/lib/psi/hash";
import { BASE_API_URL } from "@/config";
import { getConnectionSigPubKey } from "@/lib/user";
import { socketEmit } from "@/lib/socket";
import {
  errorToString,
  SocketRequestType
} from "@types";
import {
  User,
  Connection,
  UserData,
  Session
} from "@/lib/storage/types";
import { storage } from "@/lib/storage";
import { sendMessages } from "@/lib/message";
import { Socket } from "socket.io-client";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";

export type Intersection = {
  tensions: string[];
  hotTakes: string[];
  contacts: string[];
  devconEvents: string[];
  programmingLangs: string[];
  starredRepos: string[]
}

export const refreshPSI = async (user: User, connection: Connection): Promise<Intersection | null> => {
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

    let hotTakes: string[] = [];
    if (user.userData.hotTakesRating?.revealAnswers) {
      const hotTakeData = hotTakeLabels.map((hotTake, index) => {
        switch (user.userData.hotTakesRating!.rating[index]) {
          case 0:
            return "Based";
          case 1:
            return "Neutral";
          case 2:
            return "Cringe";
          default:
            return "";
        }
      });
      hotTakes = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        hotTakeData
      );
    }


    const contactData = Object.keys(user.connections);
    const contacts = await hashCommit(
      user.encryptionPrivateKey,
      connection.user.encryptionPublicKey,
      contactData
    );

    // Devcon events
    let devconEventTitles: string[] = [];
    let devconEvents: string[] = [];
    if (user.userData?.devcon?.schedule) {
      devconEventTitles = user.userData.devcon.schedule.map(event => event.title);
      devconEvents = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        devconEventTitles
      );
    }

    let languageNames: string[] = [];
    let programmingLangHashes: string[] = [];
    if (user.userData?.github?.programmingLanguages?.value) {
      languageNames = Object.keys(
        user.userData?.github?.programmingLanguages?.value
      );

      programmingLangHashes = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        languageNames
      );
    }

    let repoNames: string[] = [];
    let starredReposHashes: string[] = [];
    if (user.userData?.github?.starredRepos?.value) {
      repoNames = user.userData.github.starredRepos.value;
      starredReposHashes = await hashCommit(
        user.encryptionPrivateKey,
        connection.user.encryptionPublicKey,
        user.userData?.github?.starredRepos?.value
      );
    }

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
          intersectionState: {
            tensions,
            hotTakes,
            contacts,
            devconEvents,
            programmingLangs: programmingLangHashes,
            starredRepos: starredReposHashes,
          },
        }),
      }
    );

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

      const translatedEvents = [];
      for (const hashEvent of data.verifiedIntersectionState.devconEvents) {
        const index = devconEvents.findIndex(
          (event) => event === hashEvent
        );
        if (index !== -1) {
          translatedEvents.push(devconEventTitles[index]);
        }
      }

      const translatedLangs = [];
      for (const hashLang of data.verifiedIntersectionState.programmingLangs) {
        const index = programmingLangHashes.findIndex((lang) => lang === hashLang);
        if (index !== -1) {
          translatedLangs.push(languageNames[index]);
        }
      }

      const translatedRepos = [];
      for (const hashRepo of data.verifiedIntersectionState.starredRepos) {
        const index = starredReposHashes.findIndex(
          (repo) => repo === hashRepo
        );

        if (index !== -1) {
          translatedRepos.push(repoNames[index]);
        }
      }

      // If intersections are ever added to user state + backups that would happen here

      return {
        contacts: translatedContacts,
        tensions: data.verifiedIntersectionState.tensions,
        hotTakes: data.verifiedIntersectionState.hotTakes,
        devconEvents: translatedEvents,
        programmingLangs: translatedLangs,
        starredRepos: translatedRepos,
      }
    }
    return null;
  } catch (error) {
    console.log(`Error update intersection: ${errorToString(error)}`)
    return null;
  }
}

export const triggerConnectionRefreshPSI = async (socket: Socket, user: User, connection: Connection): Promise<void> => {
  const session = await storage.getSession();
  if (session) {
    try {
      // send message with your encrypted username -- this allows connection to know which user to refresh for
      const message = await storage.createPSIMessageAndHandleBackup(
        connection.user.username,
        user.userData.username,
      );

      await sendMessages({
        authToken: session.authTokenValue,
        messages: [message],
      });

      // Get recipient id (pub key)
      const recipient: string | null = getConnectionSigPubKey(
        user,
        connection.user.username
      );

      // If socket and recipient pub key available, send PSI push notification over socket connection
      if (socket && recipient) {
        socketEmit({
          socketInstance: socket,
          type: SocketRequestType.PULL_PSI_MSG,
          recipientSigPubKey: recipient,
        });
      }
    } catch (error) {
      // If error, surface and continue
      console.error(`Error while sending PSI refresh messages: ${error}`);
    }
  }
}

export const updateConnectionPSISize = async (newVerifiedIntersection: Intersection, user: User, session: Session, connection: Connection, triggerPull: boolean): Promise<void> => {
  // set the size of intersection here
  const intersectionSize: number = JSON.stringify(newVerifiedIntersection).length;

  const newUserData: UserData = user.userData;
  if (!newUserData.connectionPSISize) {
    newUserData.connectionPSISize = {};
  }
  if (!newUserData.pullPSI) {
    newUserData.pullPSI = {};
  }

  newUserData.connectionPSISize[connection.user.username] = intersectionSize;

  // There are two cases. In the flow User A refreshes, which then triggers User B to automatically refresh.
  // User A does not need to re-pull the intersection, after clicking refresh it's available.
  // User B has run the new intersection but needs to fetch the value.
  // In other words, User B needs to automatically pull the fresh results when they're on User A's connection page.
  if (triggerPull) {
    // If set to true, automatically post refresh to pull the most recent intersection
    newUserData.pullPSI[connection.user.username] = true;

    // Update the size on the user object
    if (user && session) {
      await updateUserData(newUserData);
    }
  }
}