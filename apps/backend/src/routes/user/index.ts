import express from "express";
import registerRoute from "./register";
import loginRoute from "./login";
import backupRoute from "./backup";
import getSigninTokenRoute from "./get_signin_token";
import verifySigninTokenRoute from "./verify_signin_token";

const router = express.Router();

router.use(registerRoute);
router.use(loginRoute);
router.use(backupRoute);
router.use(getSigninTokenRoute);
router.use(verifySigninTokenRoute);

export default router;
