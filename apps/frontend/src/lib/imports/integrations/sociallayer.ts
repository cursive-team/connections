import { z } from "zod";
import { SOCIAL_LAYER_GROUP_IDS } from "@/config";
import { updateUserDataFromImportData } from "@/lib/imports/update";
import { storage } from "@/lib/storage";
import {
  DataOption
} from "@types";
import { User } from "@/lib/storage/types";

// User group membership -- assumes email is the same between SL and Cursive
export async function slUserGroupsFetch(email: string): Promise<Response | null> {
  const query = `
    query UserMemberships {
    profiles(where: {email: {_eq: "${email}"}}) {
      memberships {
        group {
          id
          username
        }
      }
    }
  }`

  const body = {
    query,
  };

  const response = await fetch("https://graph.sola.day/v1/graphql", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response;
}

// User events -- assumes email is the same between SL and Cursive
export async function slUserEventsFetch(email: string): Promise<Response | null> {
  const query = `
    query UserEvents {
    profiles(where: {email: {_eq: "${email}"}}) {
      participants {
        event {
          title
          tags
          location
          start_time
          end_time
        }
      }
    }
  }`

  const body = {
    query,
  };

  const response = await fetch("https://graph.sola.day/v1/graphql", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response;
}

// User attendance -- assumes email is the same between SL and Cursive
export async function slUserAttendanceFetch(email: string): Promise<Response | null> {
  const query = `
    query Ticket_items($where: ticket_items_bool_exp) {
      ticket_items(where: {
        profile: {
          email: {
            _eq: "${email}"
          }
        },
        group_id: {
          _eq: ${SOCIAL_LAYER_GROUP_IDS["EDGE_CITY_LANNA"]}
        }
      }) {
        group_id
        profile {
          email
        }
        ticket {
          title
        }
      }
    }`

  const body = {
    query,
  };

  const response = await fetch("https://graph.sola.day/v1/graphql", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response;
}

export function MapSocialLayerUserGroupsToMemberships(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resp: any
): string[] {

  let memberships: string[] = [];

  if (resp?.data?.profiles?.length === 1) {
    const profile = resp.data.profiles[0];
    // Should have only email match within Edge Lanna group
    for (let membership of profile.memberships) {
      if (membership?.group?.username) {
        memberships.push(membership.group.username);
      }
    }
  }

  return memberships;
}

// Event schema
export const EventSchema = z.object({
  title: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string(),
  tags: z.array(z.string()),
});

export type Event = z.infer<typeof EventSchema>;

export function MapSocialLayerUserEventsToEvents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resp: any
): Event[] {

  let events: Event[] = [];

  if (resp?.data?.profiles?.length === 1) {
    // Should have only email match within Edge Lanna group
    const profile = resp.data.profiles[0];
    for (let participation of profile.participants) {
      let ev: Event = EventSchema.parse(participation.event);
      events.push(ev);
    }
  }
  // TODO: sort on start time
  // TODO: indicate which ones are in past vs future

  return events;
}

export function MapSocialLayerTicketItemsToAttendance(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resp: any
): Record<string, boolean> {

  let ticket: Record<string, boolean> = {};

  if (resp?.data?.ticket_items?.length === 1) {
    // Should have only one email / ticket match within Edge Lanna group
    const item = resp.data.ticket_items[0];
    if (item.ticket?.title) {
      let title: string = item.ticket.title;
      if (title.match("week1")) {
        ticket["week1"] = true;
      }
      if (title.match("week2")) {
        ticket["week2"] = true;
      }
      if (title.match("week3")) {
        ticket["week3"] = true;
      }
      if (title.match("week4")) {
        ticket["week4"] = true;
      }
    }
  }
  return ticket;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveMemberships(options: DataOption, user: User, resp: any): Promise<void> {
  const memberships: string[] = MapSocialLayerUserGroupsToMemberships(resp);

  // Update state
  const newUserData = await updateUserDataFromImportData(
    user.userData,
    options.type,
    memberships,
  );

  // Back up and update user
  await storage.updateUserData(newUserData);
  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveAttendance(options: DataOption, user: User, resp: any): Promise<void> {
  const attendance: Record<string, boolean> = MapSocialLayerTicketItemsToAttendance(resp);

  // Make backup
  const newUserData = await updateUserDataFromImportData(
    user.userData,
    options.type,
    attendance,
  );

  // Back up and update user
  await storage.updateUserData(newUserData);
  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveEvents(options: DataOption, user: User, resp: any): Promise<void> {
  const events: Event[] = MapSocialLayerUserEventsToEvents(resp);

  // Make backup
  const newUserData = await updateUserDataFromImportData(
    user.userData,
    options.type,
    events,
  );

  // Back up and update user
  await storage.updateUserData(newUserData);
  return;
}
