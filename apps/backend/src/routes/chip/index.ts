import express from "express";
import registerRoute from "./register";
import tapRoute from "./tap";
import updateRoute from "./update";
import leaderboardEntryRoute from "./leaderboard_entry";
import attendanceRoute from "./attendance";

const router = express.Router();

router.use(updateRoute);
router.use(registerRoute);
router.use(tapRoute);
router.use(leaderboardEntryRoute);
router.use(attendanceRoute);

export default router;
