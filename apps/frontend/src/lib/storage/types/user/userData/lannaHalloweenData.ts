import { z } from "zod";
import { HashableFieldSchema, nullToUndefined } from "@types";

export const LannaHalloweenDataSchema = z.object({
  mood: nullToUndefined(HashableFieldSchema),
  connectionInterests: nullToUndefined(
    z.object({
      deepConversation: nullToUndefined(HashableFieldSchema),
      danceOff: nullToUndefined(HashableFieldSchema),
      talkWork: nullToUndefined(HashableFieldSchema),
      congoLine: nullToUndefined(HashableFieldSchema),
      beNPCs: nullToUndefined(HashableFieldSchema),
      pairFortune: nullToUndefined(HashableFieldSchema),
      teamUp: nullToUndefined(HashableFieldSchema),
      chillAndVibe: nullToUndefined(HashableFieldSchema),
      introverse: nullToUndefined(HashableFieldSchema),
    })
  ),
  astrology: nullToUndefined(
    z.object({
      marsSign: nullToUndefined(HashableFieldSchema),
      mercurySign: nullToUndefined(HashableFieldSchema),
      moonSign: nullToUndefined(HashableFieldSchema),
      risingSign: nullToUndefined(HashableFieldSchema),
      sunSign: nullToUndefined(HashableFieldSchema),
      venusSign: nullToUndefined(HashableFieldSchema),
    })
  ),
  fun: nullToUndefined(
    z.object({
      goodTimes: nullToUndefined(HashableFieldSchema),
      experiences: nullToUndefined(HashableFieldSchema),
      unusualItems: nullToUndefined(HashableFieldSchema),
      uniqueChallenge: nullToUndefined(HashableFieldSchema),
    })
  ),
});

export type LannaHalloweenData = z.infer<typeof LannaHalloweenDataSchema>;
