import { Router } from "express";
import { getHome, getMarco, getPing } from "../controllers/index.controllers.js";

const router = Router();

router.get("/", getHome);
router.get("/marco", getMarco);
router.get("/ping", getPing);

export default router;
