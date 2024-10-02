import express from "express";
import registerRoute from "./register";
import tapRoute from "./tap";

const router = express.Router();

router.use(registerRoute);
router.use(tapRoute);

export default router;
