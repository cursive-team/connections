import { z } from "zod";

export const TensionsRatingSchema = z.object({
  tensionRating: z.array(z.number()),
  revealAnswers: z.boolean(),
  contributeAnonymously: z.boolean(),
});

export type TensionsRating = z.infer<typeof TensionsRatingSchema>;

export const GoDeeperSchema = z.object({
    adhd: z.boolean(),
    asd: z.boolean(),
    bipolar: z.boolean(),
    depression: z.boolean(),
    eatingDisorder: z.boolean(),
    generalizedAnxiety: z.boolean(),
    ocd: z.boolean(),
    ptsd: z.boolean(),
    schizophrenia: z.boolean(),
    personalityDisorder: z.boolean(),
});


export type GoDeeper = z.infer<typeof GoDeeperSchema>;

export const LannaDesiredConnectionsSchema = z.object({
  getHealthy: z.boolean(),
  cowork: z.boolean(),
  enjoyMeals: z.boolean(),
  learnFrontierTopics: z.boolean(),
  findCollaborators: z.boolean(),
  goExploring: z.boolean(),
  party: z.boolean(),
  doMentalWorkouts: z.boolean(),
});

export type LannaDesiredConnections = z.infer<
  typeof LannaDesiredConnectionsSchema
>;

export const LannaDataSchema = z.object({
  desiredConnections: LannaDesiredConnectionsSchema,
});

export type LannaData = z.infer<typeof LannaDataSchema>;
