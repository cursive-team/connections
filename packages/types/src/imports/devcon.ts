import { z } from "zod";

export const DevconEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  track: z.string(),
  expertise: z.string(),
  audience: z.string(),
  tags: z.string(),
  sourceId: z.string().optional(),
  eventId: z.string().nullable(),
  slot_start: z.coerce.date(),
  slot_end: z.coerce.date(),
  slot_roomId: z.string()

  /*
   "speakers":[{"id":"patricio-palladino","sourceId":"RMSFPK","name":"Patricio Palladino"

   "slot_room":{"id":"main-stage","name":"Main Stage","description":"Masks"
   */
});

export type DevconEvent = z.infer<typeof DevconEventSchema>;

export const DevconScheduleSchema = z.array(DevconEventSchema);

export type DevconSchedule = z.infer<typeof DevconScheduleSchema>;

export const DevconScheduleDataSchema = z.object({
  data: DevconScheduleSchema,
});

export type DevconScheduleData = z.infer<typeof DevconScheduleDataSchema>;