import express from "express";
import registerRoute from "./register";
import tapRoute from "./tap";
import updateRoute from "./update";

const router = express.Router();

router.use(updateRoute);
router.use(registerRoute);
router.use(tapRoute);

export default router;
