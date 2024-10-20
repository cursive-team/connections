import express from "express";
import registerRoute from "./register";
import loginRoute from "./login";
import backupRoute from "./backup";
import getSigninTokenRoute from "./get_signin_token";
import verifySigninTokenRoute from "./verify_signin_token";
import verifyEmailUniqueRoute from "./verify_email_unique";
import verifyUsernameUniqueRoute from "./verify_username_unique";
import refreshIntersectionRoute from "./refresh_intersection";

const router = express.Router();

router.use(registerRoute);
router.use(loginRoute);
router.use(backupRoute);
router.use(getSigninTokenRoute);
router.use(verifyEmailUniqueRoute);
router.use(verifySigninTokenRoute);
router.use(verifyUsernameUniqueRoute);
router.use(refreshIntersectionRoute);
export default router;
