import express from "express";
import attestationRoute from "./attestation";
import hashWithSecretRoute from "./hash_with_secret";

const router = express.Router();

router.use(attestationRoute);
router.use(hashWithSecretRoute);

export default router;
