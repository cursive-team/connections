import { z } from "zod";

export const TensionsRatingSchema = z.object({
  tensionRating: z.array(z.number()),
  revealAnswers: z.boolean(),
  contributeAnonymously: z.boolean(),
});

export type TensionsRating = z.infer<typeof TensionsRatingSchema>;

export const HotTakesRatingSchema = z.object({
  rating: z.array(z.number()),
  revealAnswers: z.boolean(),
  contributeAnonymously: z.boolean(),
});

export type HotTakesRating = z.infer<typeof HotTakesRatingSchema>;

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
