import { LeaderboardDetails, LeaderboardEntries } from "@types";

export const lannaWeek1Leaderboard = {
  andrew: 2,
  daryashakh: 1,
  memeSamsara: 2,
  coopersmout: 1,
  heymelissatan: 10,
  Jonathan: 5,
  KlausBrave: 1,
  Prakhar: 2,
  feltroidprime: 3,
  immabeyeet: 1,
  Minervana: 3,
  jamesrv: 5,
  Janine: 11,
  Poochy: 3,
  ikigaiwif606: 5,
  Timour: 2,
  lucyqiu: 2,
  jmill: 3,
  Mrjackalop: 1,
  Jake: 2,
  catsnacks: 8,
  Bern108: 1,
  s0xn1ck: 1,
  apeir99n: 1,
  Adriana: 1,
  JohnnyEnact: 2,
  Atin: 1,
  raniahashim: 13,
  darrylyeo: 8,
  donnoh: 4,
  stevenelleman: 36,
  rachel: 11,
  ren: 2,
  aleoreng: 5,
  sky: 5,
  Charlie: 1,
  vivek: 22,
  raccoon: 7,
  shotaro: 3,
  zkzhao: 5,
  Szsalim: 5,
  Mynch: 5,
  TomasCROSSLUCID: 3,
  Syntonikka: 3,
  LizSpecht: 3,
  d0wnlore: 3,
  adam: 9,
  jiminleex: 5,
  Jseam: 5,
  QtLucid: 9,
  Zoey: 4,
  Nat: 1,
  Telamon: 7,
  Sophiemofie: 7,
  Fei: 12,
  "0xsachink": 5,
  Colton: 5,
  albicodes: 7,
  linaventures: 6,
  ayushm: 7,
  Sarina: 7,
  amerameen: 7,
  maribee99: 4,
  Mikeliao: 2,
  Tessla: 36,
  ThisIsNatalie: 4,
  timber: 3,
  Vikas: 3,
  deca12x: 6,
  Angel: 3,
  petrovm: 1,
  Quinn: 3,
  FahKtty: 1,
  LucieForster: 5,
  Jesse: 1,
  mariarosz: 2,
  Olly: 1,
  marine: 1,
  martinagreiner: 7,
  Mj28Pen: 1,
  TariaBee: 7,
  Warrior: 1,
  Liran: 1,
  Chaninan: 1,
  Marlowe: 3,
  johnmho: 2,
  Kinks: 3,
  LukeFlegg: 4,
  bigkat: 1,
  ploy: 4,
  Marina: 2,
  VincentPaul: 3,
  mmjahanara: 4,
  Pt836363: 1,
  Amynokyung: 5,
  msconductor1: 1,
  neco: 1,
  distbit: 4,
  William: 1,
  JofiidaloGo: 4,
  Hus: 6,
  Metachaser: 1,
  James: 1,
  Prip: 1,
  joshwest: 3,
  devlewis: 2,
  warrenWinter: 3,
  Sajida: 3,
  Lyfeninja: 3,
  Justin: 1,
  Metageist: 4,
  ParinP: 2,
  cryptowanderer: 1,
  L0visa: 1,
  River: 1,
  BellaVE: 3,
};

export const retrieveWeeklyLeaderboard = (
  lastWeekLeaderboard: Record<string, number>,
  currentDetails: LeaderboardDetails,
  currentEntries: LeaderboardEntries
): { details: LeaderboardDetails; entries: LeaderboardEntries } => {
  const weeklyEntries: LeaderboardEntries = { entries: [] };
  const weeklyDetails: LeaderboardDetails = {
    username: currentDetails.username,
    userPosition: -1,
    totalContributors: 0,
    totalTaps: 0,
  };

  // Calculate weekly taps for each entry
  currentEntries.entries.forEach((entry) => {
    const lastWeekTaps = lastWeekLeaderboard[entry.username] || 0;
    const weeklyTaps = entry.tapCount - lastWeekTaps;

    if (weeklyTaps > 0) {
      weeklyEntries.entries.push({
        username: entry.username,
        chipIssuer: entry.chipIssuer,
        tapCount: weeklyTaps,
      });
      weeklyDetails.totalTaps += weeklyTaps;
      weeklyDetails.totalContributors++;
    }
  });

  // Sort entries by tap count in descending order
  weeklyEntries.entries.sort((a, b) => b.tapCount - a.tapCount);

  // Update user position and details
  for (let i = 0; i < weeklyEntries.entries.length; i++) {
    if (weeklyEntries.entries[i].username === currentDetails.username) {
      weeklyDetails.userPosition = i + 1;
      break;
    }
  }

  return { details: weeklyDetails, entries: weeklyEntries };
};
