import express from "express";
import registerRoute from "./register";

const router = express.Router();

router.use(registerRoute);

export default router;
