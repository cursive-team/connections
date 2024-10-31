import express from "express";
import createDataHashRoute from "./create";
import getEnclaveAttestationRoute from "./get_enclave_attestation";
import runHashJobRoute from "./run_hash_job";
import runMatchJobRoute from "./run_match_job";
import getConnectionsRoute from "./get_connections";

const router = express.Router();

router.use(createDataHashRoute);
router.use(getEnclaveAttestationRoute);
router.use(runHashJobRoute);
router.use(runMatchJobRoute);
router.use(getConnectionsRoute);

export default router;
