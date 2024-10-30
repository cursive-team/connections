import express from "express";
import createDataHashRoute from "./create";
import getEnclaveAttestationRoute from "./get_enclave_attestation";
import runHashJobRoute from "./run_hash_job";

const router = express.Router();

router.use(createDataHashRoute);
router.use(getEnclaveAttestationRoute);
router.use(runHashJobRoute);

export default router;
