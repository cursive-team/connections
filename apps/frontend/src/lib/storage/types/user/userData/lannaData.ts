import { z } from "zod";

export const LannaDesiredConnectionsSchema = z.object({
  getHealthy: z.boolean(),
  enjoyMeals: z.boolean(),
  haveCoffee: z.boolean(),
  party: z.boolean(),
  attendTalks: z.boolean(),
});

export type LannaDesiredConnections = z.infer<
  typeof LannaDesiredConnectionsSchema
>;

export const LannaDataSchema = z.object({
  desiredConnections: LannaDesiredConnectionsSchema,
});

export type LannaData = z.infer<typeof LannaDataSchema>;
