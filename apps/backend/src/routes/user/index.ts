import express from "express";
import registerRoute from "./register";
import loginRoute from "./login";
import backupRoute from "./backup";

const router = express.Router();

router.use(registerRoute);
router.use(loginRoute);
router.use(backupRoute);

export default router;
