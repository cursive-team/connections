import {z} from "zod";
import {ChipIssuer, LeaderboardEntry, LeaderboardEntryType} from "../chip";

/*
{
access_token:"***"
athlete: {
  badge_type_id:0
  bio:null
  city:"Berkeley"
  country:"United States"
  created_at:"2021-06-18T14:27:49Z"
  firstname:"Steven"
  follower:null
  friend:null
  id:87447617
  lastname:"Elleman"
  premium:false
  profile:"avatar/athlete/large.png"
  profile_medium:"avatar/athlete/medium.png"
  resource_state:2
  sex:"M"
  state:"California"
  summit:false
  updated_at:"2024-10-19T08:08:11Z"
  username:null
  weight:null
}
expires_at:1729405604
expires_in:13288
refresh_token:"***"
token_type:"Bearer"
}
 */

export const StravaAtheleteSchema = z.object({
  id: z.number(),
});

export type StravaAthelete = z.infer<typeof StravaAtheleteSchema>;

export const StravaBearerTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  token_type: z.string(),
  athlete: StravaAtheleteSchema,
});

export type StravaBearerToken = z.infer<typeof StravaBearerTokenSchema>;
