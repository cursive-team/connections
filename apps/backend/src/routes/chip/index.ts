import express from "express";
import registerRoute from "./register";
import tapRoute from "./tap";
import leaderboardEntryRoute from "./leaderboard_entry";

const router = express.Router();

router.use(registerRoute);
router.use(tapRoute);
router.use(leaderboardEntryRoute);

export default router;
